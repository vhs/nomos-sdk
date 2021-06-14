export default function log(context) {
  const getConfigLevel = () => {
    switch(context.config.logLevel) {
      case "error": return 50;
      case "warn": return 40;
      case "info": return 30;
      case "debug": return 20;
      case "trace": return 10;
      case "verbose": return 0;
    }
  }

  const write = (level) => (...objs) => {
    if (level >= getConfigLevel()) {
      console.log(...objs);
    }
  }

  return {
    error: write(50),
    warn: write(40),
    info: write(30),
    debug: write(20),
    trace: write(10)
  };
}
