import adapters from './adapters';

export default function (config = {}, adapterName = 'axios') {
  try {
    return new adapters[adapterName](config);
  } catch (err) {
    throw new Error(`Unable to create new client using adapter ${adapterName}`);
  }
}
