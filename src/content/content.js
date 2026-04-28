import {
  MESSAGE_START,
  MESSAGE_SET_END,
  MESSAGE_UNSET_END,
} from '../constants/messageTypes';
import getBadgeCanvas from '../utils/getBadgeCanvas';

const LINK_ELEM_ID = 'scs-tab-badge-favicon';
const CANVAS_SIZE = 16;
const PIXEL_RATIO = window.devicePixelRatio || 1;
const PHYSICAL_SIZE = Math.round(CANVAS_SIZE * PIXEL_RATIO);

const getLinkElem = () => {
  const selfLinkElem = document.getElementById(LINK_ELEM_ID);
  if (selfLinkElem) return selfLinkElem;

  const linkElem = document.createElement('link');
  linkElem.id = LINK_ELEM_ID;
  linkElem.rel = 'icon';
  linkElem.type = 'image/png';
  linkElem.sizes = `${PHYSICAL_SIZE}x${PHYSICAL_SIZE}`;

  return linkElem;
};

const getIconLinkElems = () => {
  const linkElems = document.head.querySelectorAll('link[rel*="icon"]');
  return Array.from(linkElems).filter(
    linkElem =>
      linkElem.id !== LINK_ELEM_ID &&
      Array.from(linkElem.relList).includes('icon'),
  );
};
const resetIconLinkElems = () => {
  getIconLinkElems().forEach(linkElem => {
    const { href } = linkElem;

    /* eslint-disable no-param-reassign */
    linkElem.href = '';
    linkElem.href = href;
    /* eslint-enable no-param-reassign */
  });
};

const getFavIconImg = dataUrl =>
  new Promise(resolve => {
    if (!dataUrl) {
      resolve();
      return;
    }

    const handleError = () => resolve();
    const handleImgLoad = e => resolve(e.target);

    const img = new Image();
    img.addEventListener('load', handleImgLoad);
    img.addEventListener('error', handleError);
    img.src = dataUrl;
  });

const getBadgeFavIconUrl = ({ favIconUrl, badgeNum, options }) => {
  if (!badgeNum) return Promise.reject();

  return getFavIconImg(favIconUrl).then(img => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = PHYSICAL_SIZE;
    canvas.height = PHYSICAL_SIZE;
    ctx.scale(PIXEL_RATIO, PIXEL_RATIO);

    if (img) ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

    const badgeCanvas = getBadgeCanvas(badgeNum, options, PIXEL_RATIO);
    const badgeLogicalWidth = badgeCanvas.width / PIXEL_RATIO;
    const badgeLogicalHeight = badgeCanvas.height / PIXEL_RATIO;
    ctx.drawImage(
      badgeCanvas,
      CANVAS_SIZE - badgeLogicalWidth,
      CANVAS_SIZE - badgeLogicalHeight,
      badgeLogicalWidth,
      badgeLogicalHeight,
    );

    return canvas.toDataURL();
  });
};

// init

const setBadgeFavIcon = favIconUrl => {
  const linkElem = getLinkElem();
  linkElem.href = favIconUrl;

  if (!linkElem.parentElement) document.head.appendChild(linkElem);

  browser.runtime.sendMessage({ type: MESSAGE_SET_END, favIconUrl });
};

const unsetBadgeFavIcon = () => {
  const linkElem = getLinkElem();
  const hadLinkElem = !!linkElem.parentElement;

  if (hadLinkElem) document.head.removeChild(linkElem);
  resetIconLinkElems();

  browser.runtime.sendMessage({ type: MESSAGE_UNSET_END, hadLinkElem });
};

browser.runtime
  .sendMessage({ type: MESSAGE_START })
  .then(getBadgeFavIconUrl)
  .then(setBadgeFavIcon)
  .catch(unsetBadgeFavIcon);
