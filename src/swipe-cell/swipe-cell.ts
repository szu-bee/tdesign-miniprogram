import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { getRect } from '../common/utils';

let ARRAY: WechatMiniprogram.Component.TrivialInstance[] = [];

const { prefix } = config;
const name = `${prefix}-swipe-cell`;
const ContainerClass = `.${name}`;

@wxComponent()
export default class SwiperCell extends SuperComponent {
  externalClasses = [`${prefix}-class`];

  options = {
    multipleSlots: true,
  };

  properties = props;

  data = {
    prefix,
    wrapperStyle: '',
    closed: true,
    opened: false,
    classPrefix: name,
  };

  attached() {
    ARRAY.push(this as WechatMiniprogram.Component.TrivialInstance);
  }

  ready() {
    this.setSwipeWidth();
  }

  setSwipeWidth() {
    Promise.all([getRect(this, `${ContainerClass}__left`), getRect(this, `${ContainerClass}__right`)]).then(
      ([leftRect, rightRect]) => {
        this.setData({
          leftWidth: leftRect.width,
          rightWidth: rightRect.width,
        });
      },
    );
  }

  detached() {
    ARRAY = ARRAY.filter((item) => item !== this);
  }

  open() {
    this.setData({ opened: true });
  }

  close() {
    this.setData({ opened: false });
  }

  closeOther() {
    ARRAY.filter((item) => item !== this).forEach((item) => item.close());
  }

  onTap() {
    this.close();
  }

  onActionTap(event) {
    const {
      currentTarget: {
        dataset: { action },
      },
    } = event;
    this.triggerEvent('click', action);
  }
}
