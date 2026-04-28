import { h } from 'hyperapp';

import getBadgeCanvas from '../../utils/getBadgeCanvas';

const Badge = ({ badgeNum, options }) => {
  const badgeCanvas = getBadgeCanvas(badgeNum, options);
  const badgeUrl = badgeCanvas.toDataURL();

  return h('div', { class: 'badge-container' },
    h('img', { class: 'badge', src: badgeUrl }),
  );
};

export default Badge;
