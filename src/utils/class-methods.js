function getClassMethods(className) {
  let proto = className.prototype;
  let methods = Object.getOwnPropertyNames(proto).filter((name) => {
    return typeof proto[name] === "function" && name !== "constructor";
  });
  return methods;
}

export default getClassMethods;
