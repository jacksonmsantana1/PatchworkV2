const getMeasurement = (polygon, pattern) => ({
  a: polygon.a,
  b: polygon.b,
  type: polygon.type,
  image: pattern.image.href,
});

const getBlockMeasurement = block =>
  block.polygons.map((polygon, index) =>
    getMeasurement(polygon, block.patterns[index]));

const getBlocksMeasurement = blocks =>
  blocks.map(block => getBlockMeasurement(block))
  .reduce((prev, curr) => prev.concat(curr));

const compareMeasurements = (m1, m2) =>
  (m1.a === m2.a && m1.b === m2.b && m1.type === m2.type && m1.image === m2.image);

const groupMeasurements = blocks =>
  getBlocksMeasurement(blocks).reduce((groups, item) => {
    const measurements = groups;
    const measure = item;

    const a = measure.a || 0;
    const b = measure.b || 0;
    const type = measure.type || '';
    const image = measure.image || '';
    const val = `${type}*${a}*${b}*${image}`;

    measurements[val] = measurements[val] || 0;
    measurements[val] += 1;

    return measurements;
  }, {});

const getMeasurementFromStr = (str) => {
  const props = str.split('*');
  return {
    type: props[0],
    a: parseInt(props[1], 10),
    b: parseInt(props[2], 10),
    image: props[3],
  };
};

const getProjectMeasurement = svg => groupMeasurements([svg]);

export default {
  getMeasurement,
  getBlockMeasurement,
  getBlocksMeasurement,
  compareMeasurements,
  groupMeasurements,
  getMeasurementFromStr,
  getProjectMeasurement,
};
