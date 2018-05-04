import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import RecyclerListItem from './RecyclerListItem';

export default class RecyclerListItems extends React.PureComponent {
  static displayName = 'RecyclerListItems';

  static propTypes = {
    endIndex: PropTypes.number.isRequired,
    getKey: PropTypes.func.isRequired,
    itemHeights: PropTypes.instanceOf(Immutable.Map).isRequired,
    items: PropTypes.instanceOf(Immutable.List).isRequired,
    renderItem: PropTypes.func.isRequired,
    startIndex: PropTypes.number.isRequired,
    startTop: PropTypes.number.isRequired,
    onItemMounted: PropTypes.func.isRequired,
    onItemUpdated: PropTypes.func.isRequired,
    onItemWillUnmount: PropTypes.func.isRequired,
  };

  render() {
    let startTop = this.props.startTop;
    return this.props.items.slice(this.props.startIndex, this.props.endIndex).map((item, index) => {
      const itemTop = startTop;
      startTop += this.props.itemHeights.get(this.props.startIndex + index, 0);
      return (
        <RecyclerListItem
          key={this.props.getKey(item)}
          index={this.props.startIndex + index}
          item={item}
          top={itemTop}
          renderItem={this.props.renderItem}
          onMounted={this.props.onItemMounted}
          onUpdated={this.props.onItemUpdated}
          onWillUnmount={this.props.onItemWillUnmount}
        />
      );
    });
  }
}
