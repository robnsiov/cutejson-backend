import { getProperty, setProperty, deleteProperty } from "dot-prop";
import sortOn from "sort-on";

class Query {
  query: any = null;
  filtered: Array<any> = [];
  constructor(array: Array<any>, query?: string) {
    this.filtered = array;
    this.query = query;
  }
  startsWith(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter((item) =>
      (getProperty(item, this.query) as string).startsWith(value)
    );
    return this;
  }

  endsWith(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter((item) =>
      (getProperty(item, this.query) as string).endsWith(value)
    );
    return this;
  }
  strictEqual(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) === value
    );
    return this;
  }
  equal(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) == value
    );
    return this;
  }
  strictNotEqual(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => getProperty(item, this.query) !== value
    );
    return this;
  }

  notEqual(value: string, q?: string) {
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
  sort(q: string) {
    this.filtered = sortOn(this.filtered, q);
    return this;
  }

  gt(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => (getProperty(item, this.query) as number) > +value
    );
    return this;
  }
  gte(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => (getProperty(item, this.query) as number) >= +value
    );
    return this;
  }
  lt(value: string, q?: number) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => (getProperty(item, this.query) as number) < +value
    );
    return this;
  }
  lte(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => (getProperty(item, this.query) as number) <= +value
    );
    return this;
  }
  contains(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter((item) =>
      (getProperty(item, this.query) as string).includes(value)
    );
    return this;
  }
  notContains(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => !(getProperty(item, this.query) as string).includes(value)
    );
    return this;
  }
  length(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter(
      (item) => (getProperty(item, this.query) as any).length == value
    );
    return this;
  }
  regex(value: string, q?: string) {
    if (q) this.query = q;
    this.filtered = this.filtered.filter((item) =>
      (getProperty(item, this.query) as string).match(value)
    );
    return this;
  }
  noSelect(values: Array<string>) {
    this.filtered.forEach((_, i) => {
      values.forEach((value) => {
        deleteProperty(this.filtered[i], value);
      });
    });
    return this;
  }
  populate(q: string, table: Array<any>, nextQ: string) {
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
