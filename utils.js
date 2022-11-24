import config from "./config.json" assert {type: 'json'};
import lodash from 'lodash';

export function getUpdatedNotionData(data) {
  let hasChange = false;
  const result = {
    notion: {}
  };

  config.fieldMapping.forEach(map => {
    const sourceData = lodash.get(data, map.source);

    if (!!sourceData && lodash.get(data, map.destination) !== sourceData) {
      lodash.set(result, map.destination, sourceData);
      hasChange = true;
    }

  });

  return hasChange ? result.notion : null;
}
