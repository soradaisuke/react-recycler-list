import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { createSelector } from 'reselect';
import RecyclerListItems from './RecyclerListItems';

const itemsSelector = createSelector(
  [
    (state, props) => props.items,
    state => state.itemHeights,
    state => Math.floor(state.startPosition / state.threshold) * state.threshold,
    state => Math.ceil(state.endPosition / state.threshold) * state.threshold,
  ],
  (items, itemHeights, startPosition, endPosition) => {
    let startIndex = -1;
    let startTop = 0;
    let endIndex = -1;
    let currentTop = 0;

    items.forEach((item, index) => {
      const itemHeight = itemHeights.get(index, 0);
      if (startIndex === -1 && startPosition <= currentTop + itemHeight) {
        startIndex = index;
        startTop += currentTop;
      }
      if (endIndex === -1 && endPosition <= currentTop + itemHeight) {
        endIndex = index;
      }
      currentTop += itemHeight;

      return startIndex === -1 || endIndex === -1;
    });

    if (endIndex === -1) {
      endIndex = items.size;
    }

    return {
      startIndex,
      endIndex,
      startTop,
    };
  },
);

export default class RecyclerList extends React.PureComponent {
  static displayName = 'RecyclerList';

  static propTypes = {
    getKey: PropTypes.func.isRequired,
    items: PropTypes.instanceOf(Immutable.List).isRequired,
    renderItem: PropTypes.func.isRequired,
    className: PropTypes.string,
    onScroll: PropTypes.func,
    onUpdated: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    onScroll: null,
    onUpdated: null,
  };

  state = {
    height: 0,
    startPosition: 0,
    endPosition: 0,
    threshold: 1,
    itemHeights: Immutable.Map(),
  }

  componentDidUpdate() {
    if (this.props.onUpdated) {
      this.props.onUpdated();
    }
  }

  onRef = (el) => {
    this.el = el;
    this.update();
  }

  onScroll = () => {
    if (this.props.onScroll) {
      this.props.onScroll();
    }

    this.update();
  }

  onItemMounted = (el, item, index) => {
    const clientHeight = el.clientHeight;
    this.setState((prevState) => {
      const prevHeight = prevState.itemHeights.get(index, 0);
      if (!prevHeight || prevHeight !== clientHeight) {
        return {
          height: prevState.height + (!prevHeight ? clientHeight : (clientHeight - prevHeight)),
          itemHeights: prevState.itemHeights.set(index, clientHeight),
        };
      }
      return null;
    });
  }

  onItemWillUnmount = (el, item, index) => {
    if (item !== this.props.items.get(index)) {
      this.setState(prevState => ({
        height: prevState.height - prevState.itemHeights.get(index, 0),
        itemHeights: prevState.itemHeights.set(index, 0),
      }));
    }
  }

  get clientHeight() {
    return this.el ? this.el.clientHeight : 0;
  }

  get scrollHeight() {
    return this.el ? this.el.scrollHeight : 0;
  }

  get scrollTop() {
    return this.el ? this.el.scrollTop : 0;
  }

  scrollToBottom() {
    if (this.el) {
      this.el.scrollTop = this.el.scrollHeight;
    }
  }

  update() {
    if (this.el) {
      this.setState({
        startPosition: this.el.scrollTop - this.el.clientHeight,
        endPosition: this.el.scrollTop + (this.el.clientHeight * 2),
        threshold: this.el.clientHeight / 2,
      });
    }
  }

  render() {
    const { startIndex, endIndex, startTop } = itemsSelector(this.state, this.props);
    const style = {
      height: `${this.state.height}px`,
      width: '100%',
      minHeight: '100%',
      position: 'relative',
    };

    return (
      <div
        className={this.props.className}
        ref={this.onRef}
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
        onScroll={this.onScroll}
      >
        <div style={style}>
          <RecyclerListItems
            endIndex={endIndex}
            getKey={this.props.getKey}
            itemHeights={this.state.itemHeights}
            items={this.props.items}
            renderItem={this.props.renderItem}
            startIndex={startIndex}
            startTop={startTop}
            onItemMounted={this.onItemMounted}
            onItemUpdated={this.onItemMounted}
            onItemWillUnmount={this.onItemWillUnmount}
          />
        </div>
      </div>
    );
  }
}
