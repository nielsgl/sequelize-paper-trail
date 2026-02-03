import { diff } from 'deep-diff';

const diffObjects = (current, next) => diff(current, next) || null;

export default diffObjects;
