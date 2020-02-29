webpackHotUpdate("static/development/pages/books.js",{

/***/ "./pages/books/index.js":
/*!******************************!*\
  !*** ./pages/books/index.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! styled-jsx/style */ "./node_modules/styled-jsx/style.js");
/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/head */ "./components/head.js");
/* harmony import */ var _components_nav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/nav */ "./components/nav.js");
/* harmony import */ var _components_layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/layout */ "./components/layout.js");
/* harmony import */ var _components_readinglist__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../components/readinglist */ "./components/readinglist.js");
var _jsxFileName = "/Users/drewstone/code/myblog/pages/books/index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;






var Books = function Books() {
  return __jsx(_components_layout__WEBPACK_IMPORTED_MODULE_4__["default"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, Object(_components_head__WEBPACK_IMPORTED_MODULE_2__["default"])('Books'), Object(_components_nav__WEBPACK_IMPORTED_MODULE_3__["default"])(true), __jsx("div", {
    className: "jsx-3497537984" + " " + "hero",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, __jsx("div", {
    className: "jsx-3497537984" + " " + "row",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }, __jsx("div", {
    className: "jsx-3497537984" + " " + "pure-g",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, __jsx("h1", {
    className: "jsx-3497537984" + " " + "title",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: this
  }, "Books"), __jsx("div", {
    className: "jsx-3497537984" + " " + "pure-u-1-1",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, __jsx("div", {
    className: "jsx-3497537984" + " " + "row-content",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, __jsx("p", {
    className: "jsx-3497537984" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, "Here you can find what I've read and am currently reading, this list starts from the year 2020."), __jsx("div", {
    className: "jsx-3497537984" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, __jsx("input", {
    type: "checkbox",
    checked: true,
    disabled: true,
    readOnly: true,
    className: "jsx-3497537984",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }), "Disabled grey boxes indicate books I've finished"), __jsx("div", {
    className: "jsx-3497537984" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, __jsx("input", {
    type: "checkbox",
    checked: true,
    readOnly: true,
    className: "jsx-3497537984",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }), "Checked white boxes indicate books I'm currently reading"), __jsx("div", {
    className: "jsx-3497537984" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, __jsx("input", {
    type: "checkbox",
    readOnly: true,
    className: "jsx-3497537984",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    },
    __self: this
  }), "Unchecked white boxes indicate books I hope to read soon"), __jsx("ul", {
    className: "jsx-3497537984" + " " + "pure-controls description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, Object(_components_readinglist__WEBPACK_IMPORTED_MODULE_5__["haveRead"])().map(function (book, inx) {
    return __jsx("li", {
      key: inx,
      className: "jsx-3497537984" + " " + "card-grey",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 36
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-3497537984" + " " + "pure-u-7-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 37
      },
      __self: this
    }, __jsx("input", {
      id: "cb",
      type: "checkbox",
      checked: true,
      disabled: true,
      readOnly: true,
      className: "jsx-3497537984",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 38
      },
      __self: this
    }), __jsx("label", {
      className: "jsx-3497537984" + " " + "book-title",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39
      },
      __self: this
    }, book.title)), __jsx("div", {
      className: "jsx-3497537984" + " " + "pure-u-1-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 41
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-3497537984" + " " + "read-link",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 42
      },
      __self: this
    }, __jsx("center", {
      className: "jsx-3497537984",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 43
      },
      __self: this
    }, __jsx("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: book.href,
      className: "jsx-3497537984",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 43
      },
      __self: this
    }, "Read")))));
  }), Object(_components_readinglist__WEBPACK_IMPORTED_MODULE_5__["amReading"])().map(function (book, inx) {
    return __jsx("li", {
      key: inx,
      className: "jsx-3497537984" + " " + "card",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 51
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-3497537984" + " " + "pure-u-7-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 52
      },
      __self: this
    }, __jsx("input", {
      id: "cb",
      type: "checkbox",
      checked: true,
      readOnly: true,
      className: "jsx-3497537984",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 53
      },
      __self: this
    }), __jsx("label", {
      className: "jsx-3497537984" + " " + "book-title",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 54
      },
      __self: this
    }, book.title)), __jsx("div", {
      className: "jsx-3497537984" + " " + "pure-u-1-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 56
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-3497537984" + " " + "read-link",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 57
      },
      __self: this
    }, __jsx("center", {
      className: "jsx-3497537984",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 58
      },
      __self: this
    }, __jsx("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: book.href,
      className: "jsx-3497537984",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 58
      },
      __self: this
    }, "Read")))));
  }), Object(_components_readinglist__WEBPACK_IMPORTED_MODULE_5__["planningToRead"])().map(function (book, inx) {
    return __jsx("li", {
      key: inx,
      className: "jsx-3497537984" + " " + "card",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 66
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-3497537984" + " " + "pure-u-7-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 67
      },
      __self: this
    }, __jsx("input", {
      id: "cb",
      type: "checkbox",
      readOnly: true,
      className: "jsx-3497537984",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 68
      },
      __self: this
    }), __jsx("label", {
      className: "jsx-3497537984" + " " + "book-title",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 69
      },
      __self: this
    }, book.title)), __jsx("div", {
      className: "jsx-3497537984" + " " + "pure-u-1-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 71
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-3497537984" + " " + "read-link",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 72
      },
      __self: this
    }, __jsx("center", {
      className: "jsx-3497537984",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 73
      },
      __self: this
    }, __jsx("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: book.href,
      className: "jsx-3497537984",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 73
      },
      __self: this
    }, "Read")))));
  }))))))), __jsx(styled_jsx_style__WEBPACK_IMPORTED_MODULE_0___default.a, {
    id: "3497537984",
    __self: this
  }, ".hero.jsx-3497537984{width:100%;color:#333;}.title.jsx-3497537984{margin:0;width:100%;padding-top:20px;line-height:1.15;font-size:30px;text-align:center;font-family:'Roboto Mono',monospace;-webkit-letter-spacing:0px;-moz-letter-spacing:0px;-ms-letter-spacing:0px;letter-spacing:0px;}.description.jsx-3497537984{text-align:left;font-family:'Roboto Mono',monospace;}.row.jsx-3497537984{max-width:880px;margin:20px auto 40px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:space-around;-webkit-justify-content:space-around;-ms-flex-pack:space-around;justify-content:space-around;}.row-content.jsx-3497537984{margin:0 0.5rem;}.card.jsx-3497537984{padding:9px 9px 12px;text-align:left;-webkit-text-decoration:none;text-decoration:none;color:#434343;border:1px solid #9b9b9b;}.card-grey.jsx-3497537984{padding:9px 9px 9px;text-align:left;-webkit-text-decoration:none;text-decoration:none;background-color:#F0F0F0;border:1px solid #9b9b9b;}.card.jsx-3497537984:hover{border-color:#067df7;}.card-grey.jsx-3497537984:hover{border-color:#067df7;}ul.jsx-3497537984{padding-left:0px;}li.jsx-3497537984{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}.book-title.jsx-3497537984{width:100%;font-family:'Roboto Mono',monospace;margin-left:10px;}.read-link.jsx-3497537984{margin:-5px;border:thick solid #add8e6;border-radius:5px;background-color:white;font-family:'Roboto Mono',monospace;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kcmV3c3RvbmUvY29kZS9teWJsb2cvcGFnZXMvYm9va3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBcUZrQixBQUdvQixBQUlGLEFBVU8sQUFJQSxBQU9BLEFBR0ssQUFPRCxBQU9DLEFBR0EsQUFHSixBQUdKLEFBR0YsQUFLQyxTQXRERCxFQUpBLEFBc0QwQixDQUtWLElBN0NVLEFBSWYsQUFPeEIsQ0F1QkEsR0EzQ21CLEFBOEJELENBUEEsQUFjbEIsQUFHQSxDQTVDQSxjQW1DdUIsQ0E5QkosQUF1QkksQ0FWUixDQXlDSyxRQUxELEtBeENuQixFQVJpQixHQXNEUSxPQUx6QixLQWhEb0IsS0EyQ3BCLE1BV3VDLE1BekJaLENBNUJZLEFBcUJ2QixjQUNXLFVBT0EsQ0FsQk4sSUEyQ3JCLE9BckRxQixHQXNCckIsVUFPQSw2Q0FsQitCLG1DQVYvQix3RkFXQSIsImZpbGUiOiIvVXNlcnMvZHJld3N0b25lL2NvZGUvbXlibG9nL3BhZ2VzL2Jvb2tzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBIZWFkIGZyb20gJy4uLy4uL2NvbXBvbmVudHMvaGVhZCc7XG5pbXBvcnQgTmF2IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvbmF2JztcbmltcG9ydCBMYXlvdXQgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9sYXlvdXQnO1xuaW1wb3J0IHsgaGF2ZVJlYWQsIGFtUmVhZGluZywgcGxhbm5pbmdUb1JlYWQgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL3JlYWRpbmdsaXN0JztcblxuXG5jb25zdCBCb29rcyA9ICgpID0+IChcbiAgPExheW91dD5cbiAgICB7IEhlYWQoJ0Jvb2tzJykgfVxuICAgIHsgTmF2KHRydWUpIH1cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm9cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVyZS1nXCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRpdGxlXCI+Qm9va3M8L2gxPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVyZS11LTEtMVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93LWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICBIZXJlIHlvdSBjYW4gZmluZCB3aGF0IEkndmUgcmVhZCBhbmQgYW0gY3VycmVudGx5IHJlYWRpbmcsIHRoaXMgbGlzdCBzdGFydHMgZnJvbSB0aGUgeWVhciAyMDIwLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17dHJ1ZX0gZGlzYWJsZWQgcmVhZE9ubHkvPlxuICAgICAgICAgICAgICAgIERpc2FibGVkIGdyZXkgYm94ZXMgaW5kaWNhdGUgYm9va3MgSSd2ZSBmaW5pc2hlZFxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXt0cnVlfSByZWFkT25seS8+XG4gICAgICAgICAgICAgICAgQ2hlY2tlZCB3aGl0ZSBib3hlcyBpbmRpY2F0ZSBib29rcyBJJ20gY3VycmVudGx5IHJlYWRpbmdcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgcmVhZE9ubHkvPlxuICAgICAgICAgICAgICAgIFVuY2hlY2tlZCB3aGl0ZSBib3hlcyBpbmRpY2F0ZSBib29rcyBJIGhvcGUgdG8gcmVhZCBzb29uXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwicHVyZS1jb250cm9scyBkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGhhdmVSZWFkKCkubWFwKChib29rLCBpbngpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17XCJjYXJkLWdyZXlcIn0ga2V5PXtpbnh9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVyZS11LTctOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY2JcIiB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXt0cnVlfSBkaXNhYmxlZCByZWFkT25seS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYm9vay10aXRsZVwiPntib29rLnRpdGxlfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdXJlLXUtMS04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlYWQtbGlua1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2VudGVyPjxhIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiBocmVmPXtib29rLmhyZWZ9PlJlYWQ8L2E+PC9jZW50ZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGFtUmVhZGluZygpLm1hcCgoYm9vaywgaW54KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJjYXJkXCIga2V5PXtpbnh9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVyZS11LTctOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY2JcIiB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXt0cnVlfSByZWFkT25seS8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYm9vay10aXRsZVwiPntib29rLnRpdGxlfTwvbGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdXJlLXUtMS04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlYWQtbGlua1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2VudGVyPjxhIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiBocmVmPXtib29rLmhyZWZ9PlJlYWQ8L2E+PC9jZW50ZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBsYW5uaW5nVG9SZWFkKCkubWFwKChib29rLCBpbngpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImNhcmRcIiBrZXk9e2lueH0+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdXJlLXUtNy04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjYlwiIHR5cGU9XCJjaGVja2JveFwiIHJlYWRPbmx5Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJib29rLXRpdGxlXCI+e2Jvb2sudGl0bGV9PC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1cmUtdS0xLThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVhZC1saW5rXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxjZW50ZXI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiIGhyZWY9e2Jvb2suaHJlZn0+UmVhZDwvYT48L2NlbnRlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgICAgPHN0eWxlIGpzeD57YFxuICAgICAgLmhlcm8ge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgY29sb3I6ICMzMzM7XG4gICAgICB9XG4gICAgICAudGl0bGUge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nLXRvcDogMjBweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTU7XG4gICAgICAgIGZvbnQtc2l6ZTogMzBweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBmb250LWZhbWlseTogJ1JvYm90byBNb25vJywgbW9ub3NwYWNlO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMHB4O1xuICAgICAgfVxuICAgICAgLmRlc2NyaXB0aW9uIHtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgZm9udC1mYW1pbHk6ICdSb2JvdG8gTW9ubycsIG1vbm9zcGFjZTtcbiAgICAgIH1cbiAgICAgIC5yb3cge1xuICAgICAgICBtYXgtd2lkdGg6IDg4MHB4O1xuICAgICAgICBtYXJnaW46IDIwcHggYXV0byA0MHB4O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbiAgICAgIH1cbiAgICAgIC5yb3ctY29udGVudCB7XG4gICAgICAgIG1hcmdpbjogMCAwLjVyZW07XG4gICAgICB9XG4gICAgICAuY2FyZCB7XG4gICAgICAgIHBhZGRpbmc6IDlweCA5cHggMTJweDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICBjb2xvcjogIzQzNDM0MztcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgIzliOWI5YjtcbiAgICAgIH1cbiAgICAgIC5jYXJkLWdyZXkge1xuICAgICAgICBwYWRkaW5nOiA5cHggOXB4IDlweDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRjBGMEYwO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjOWI5YjliO1xuICAgICAgfVxuICAgICAgLmNhcmQ6aG92ZXIge1xuICAgICAgICBib3JkZXItY29sb3I6ICMwNjdkZjc7XG4gICAgICB9XG4gICAgICAuY2FyZC1ncmV5OmhvdmVyIHtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAjMDY3ZGY3O1xuICAgICAgfVxuICAgICAgdWwge1xuICAgICAgICBwYWRkaW5nLWxlZnQ6IDBweDtcbiAgICAgIH1cbiAgICAgIGxpIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIH1cbiAgICAgIC5ib29rLXRpdGxlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvIE1vbm8nLCBtb25vc3BhY2U7XG4gICAgICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICAgICAgfVxuICAgICAgLnJlYWQtbGluayB7XG4gICAgICAgIG1hcmdpbjogLTVweDtcbiAgICAgICAgYm9yZGVyOiB0aGljayBzb2xpZCAjYWRkOGU2O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICAgICAgICBmb250LWZhbWlseTogJ1JvYm90byBNb25vJywgbW9ub3NwYWNlO1xuICAgICAgfVxuICAgIGB9PC9zdHlsZT5cbiAgPC9MYXlvdXQ+XG4pXG5cbmV4cG9ydCBkZWZhdWx0IEJvb2tzXG4iXX0= */\n/*@ sourceURL=/Users/drewstone/code/myblog/pages/books/index.js */"));
};

/* harmony default export */ __webpack_exports__["default"] = (Books);

/***/ })

})
//# sourceMappingURL=books.js.4312a5fbce564818159b.hot-update.js.map