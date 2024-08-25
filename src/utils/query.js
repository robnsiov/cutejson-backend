import { getProperty, setProperty, deleteProperty } from "dot-prop";
import sortOn from "sort-on";

class Query {
  query = null;
  filtered = [];
  constructor(array, query) {
    this.filtered = array;
    this.query = query;
  }
  startsWith(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter((item) =>
      getProperty(item, this.query).startsWith(value)
    );
    return this;
  }

  endsWith(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter((item) =>
      getProperty(item, this.query).endsWith(value)
    );
    return this;
  }
  strictEqual(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) === value
    );
    return this;
  }
  equal(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) == value
    );
    return this;
  }
  strictNotEqual(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) !== value
    );
    return this;
  }

  notEqual(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) != value
    );
    return this;
  }
  page(limit = 10, offset = 0) {
    this.filtered = this.filtered.slice(offset, offset + limit);
    return this;
  }
  sort(q) {
    this.filtered = sortOn(this.filtered, q);
    return this;
  }

  gt(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) > +value
    );
    return this;
  }
  gte(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) >= +value
    );
    return this;
  }
  lt(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) < +value
    );
    return this;
  }
  lte(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) <= +value
    );
    return this;
  }
  contains(value, q) {
    // string
    if (q) this.query = q;
    this.filtered = this.filtered.filter((item) =>
      getProperty(item, this.query).includes(value)
    );
    return this;
  }
  notContains(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => !getProperty(item, this.query).includes(value)
    );
    return this;
  }
  length(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query).length == value
    );
    return this;
  }
  regex(value, q) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter((item) =>
      getProperty(item, this.query).match(value)
    );
    return this;
  }
  noSelect(values) {
    this.filtered.forEach((_, i) => {
      values.forEach((value) => {
        deleteProperty(this.filtered[i], value);
      });
    });
    return this;
  }
  populate(q, table, nextQ) {
    if (q) this.query = q;
    this.filtered.forEach((item) => {
      const prp = getProperty(item, this.query);
      if (!prp) setProperty(item, this.query, null);
      const hasSeted = table.some((row) => {
        const nextPrp = getProperty(row, nextQ);
        if (nextPrp == prp) {
          setProperty(item, this.query, row);
          return true;
        } else return false;
      });
      if (!hasSeted) setProperty(item, this.query, null);
    });
    return this;
  }
}

export default Query;
