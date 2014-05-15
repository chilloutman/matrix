
(function () {
  "use strict";

  // Matrixes are represented by 2-dimensional arrays inside "Matrix" objects.
  // Operation make heavy use of semi-functional idioms like map/reduce.

  var Matrix = function (arrays) {
    this.arrays = arrays;
  };

  // - Basics, Getters

  Matrix.prototype.getRows = function () {
    return this.arrays;
  };

  Matrix.prototype.getRow = function (index) {
    return this.getRows()[index];
  };

  Matrix.prototype.getColumns = function () {
    var columns = [];
    this.getRows().forEach(function (row, i) {
      row.forEach(function (value, j) {
        if (!columns[j]) {
          columns[j] = [];
        }
        columns[j][i] = value;
      });
    });
    return columns;
  };

  Matrix.prototype.getColumn = function (index) {
    return this.getColumns()[index];
  };

  Matrix.prototype.getValue = function (x, y) {
    if (!this.getRow(x) || this.getRow(x)[y] === undefined) {
      return undefined;
    }
    return this.getRow(x)[y];
  };

  Matrix.prototype.toString = function () {
    var result = '';

    this.getRows().forEach(function (row) {
      result += '| ';
      row.forEach(function (value) {
        result += ' ' + paddedString(value, 3) + ' |';
      });
      result += '\n';
    });

    return result;
  };

  // - Operations

  Matrix.prototype.add = function (matrix) {
    // Add every value at (x,y) in "this" to the value at (x,y) in matrix.
    return new Matrix(
      this.getRows().map(addRowValues)
    );

    function addRowValues(row, x) {
      return row.map(function (value, y) {
        return value + matrix.getValue(x, y);
      });
    }
  };

  Matrix.prototype.multiplyScalar = function (scalar) {
    // Multiply every value with the scalar.
    return new Matrix(
      this.getRows().map(function (row) {
        return row.map(function (value) {
          return value * scalar;
        });
      })
    );
  };

  Matrix.prototype.multiplyMatrix = function(matrix) {
    return new Matrix(
      this.getRows().map(function (row) {
        return matrix.getColumns().map(function (column) {
          // Multiply row values with corresponding column values using "map"
          // and then sum it all up with "reduce".
          return column.map(function (value, i) {
            return row[i] * value;
          }).reduce(sum);
        });
      })
    );
  };

  Matrix.prototype.transpose = function () {
    return new Matrix(this.getColumns());
  };

  // - Utilities

  function sum(a, b) {
    return a + b;
  }

  function paddedString(input, length) {
    if (input === undefined) {
      return '';
    }
    var string = input.toString();
    while (string.length < length) {
      string = ' ' + string;
    }
    return string;
  }

  // - Tests

  function print(string) {
    console.log(string);

    // Print the string to the output element in the DOM.
    string = string
      .replace(/\n/g, '<br>')
      //.replace(/ /g, '&nbsp;')
      + '<br>';
    document.getElementById('output').innerHTML += string;
  }

  var m = new Matrix([
    [ 1, 2 ],
    [ 3, 4 ],
    [ 5, 6 ]
  ]);

  var n = new Matrix([
    [ 1, 0, 3 ],
    [ 0, 2, 0 ]
  ]);

  print('m: \n' + m);
  print('n: \n' + n);

  print('m transposed: \n' + m.transpose());
  print('m * 2: \n' + m.multiplyScalar(2));

  print('m + n: \n' + m.add(n));
  print('m * n: \n' + m.multiplyMatrix(n));
  print('n * m: \n' + n.multiplyMatrix(m));

})();
