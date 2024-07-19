import lodash from "lodash";
import getClassMethods from "./class-methods.js";
import Query from "./query.js";

const filterByQuery = (data, qu) => {
  let status = "";
  let error = "";
  let filtered = null;
  if (Array.isArray(data)) {
    const query = qu;
    if (!lodash.isEmpty(query)) {
      const parsedQuery = {};
      Object.entries(query).forEach(([key, value]) => {
        parsedQuery[key] = `${value}`.includes(",")
          ? `${value}`.split(",")
          : value;
      });
      const querKey = parsedQuery.query;
      delete parsedQuery.query;
      let invalidMethod = "";
      Object.keys(parsedQuery).forEach((key) => {
        if (!invalidMethod) {
          const QueryMethods = getClassMethods(Query);
          const index = QueryMethods.indexOf(key);
          if (index === -1) invalidMethod = key;
        }
      });
      if (invalidMethod) {
        status = "return error";
        error = `${invalidMethod} is not a valid params!`;
      } else {
        const q = new Query(data, querKey);
        try {
          Object.entries(parsedQuery).forEach(([key, value]) => {
            if (key === "noSelect") {
              if (Array.isArray(value)) q[key](value);
              else q[key]([value]);
            } else {
              if (Array.isArray(value)) q[key](value[0], value[1]);
              else q[key](value);
            }
          });
          status = "return filtered";
          filtered = q.filtered;
        } catch (error) {
          status = "return error";
          error = "Bad query values!";
        }
      }
    } else {
      status = "return data";
    }
  } else {
    if (data == null) {
      status = "return null";
    } else {
      status = "return data";
    }
  }
  return { filtered, status, error };
};

export default filterByQuery;
