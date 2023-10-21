"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Metric = void 0;

class Metric {
  constructor(name, dimensions) {
    this.name = name;
    this.dimensions = dimensions;
  }

  getDimensions() {
    return this.dimensions;
  }

  getName() {
    return this.name;
  }

  getSeries(qualifier) {
    return [this.name, qualifier].join('.');
  }

  toString() {
    return JSON.stringify({
      name: this.getName(),
      dimensions: this.getDimensions()
    }, null, 2);
  }

}

exports.Metric = Metric;