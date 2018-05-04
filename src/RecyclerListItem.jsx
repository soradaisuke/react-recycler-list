import React from 'react';
import PropTypes from 'prop-types';

export default class RecyclerListItem extends React.PureComponent {
  static displayName = 'RecyclerListItem';

  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    renderItem: PropTypes.func.isRequired,
    top: PropTypes.number.isRequired,
    onMounted: PropTypes.func.isRequired,
    onUpdated: PropTypes.func.isRequired,
    onWillUnmount: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.onMounted(this.el, this.props.item, this.props.index);
  }

  componentDidUpdate() {
    this.props.onUpdated(this.el, this.props.item, this.props.index);
  }

  componentWillUnmount() {
    this.props.onWillUnmount(this.el, this.props.item, this.props.index);
  }

  onRef = (el) => {
    this.el = el;
  }

  render() {
    const style = {
      width: '100%',
      position: 'absolute',
      left: '0',
      top: `${this.props.top}px`,
    };

    return (
      <div style={style} ref={this.onRef}>
        {
          this.props.renderItem(this.props.item)
        }
      </div>
    );
  }
}
