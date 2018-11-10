const engine = new Worker('./engine/engine.js');
engine.onmessage = ({data}) => {
  console.log(data);
};
