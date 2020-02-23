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
/* harmony import */ var isomorphic_unfetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! isomorphic-unfetch */ "./node_modules/next/dist/build/polyfills/fetch/index.js");
/* harmony import */ var isomorphic_unfetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(isomorphic_unfetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/head */ "./node_modules/next/dist/next-server/lib/head.js");
/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_nav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/nav */ "./components/nav.js");
var _jsxFileName = "/Users/drewstone/code/myblog/pages/books/index.js";

var __jsx = react__WEBPACK_IMPORTED_MODULE_2___default.a.createElement;





var haveRead = function haveRead() {
  return [{
    title: 'Wild Sheep Chase',
    href: 'https://www.amazon.com/Wild-Sheep-Chase-Novel/dp/037571894X'
  }, {
    title: 'The Jew in the Lotus: A Poet\'s Rediscovery of Jewish Identity in Buddhist India',
    href: 'https://www.amazon.com/Jew-Lotus-Rediscovery-Identity-Buddhist-ebook/dp/B000Z4JQNS'
  }, {
    title: 'Joyful Wisdom',
    href: 'https://www.amazon.com/Joyful-Wisdom-Embracing-Finding-Freedom/dp/B00262UAYQ'
  }, {
    title: 'What I Talk About When I Talk About Running',
    href: 'https://www.amazon.com/What-Talk-About-When-Running/dp/0307389839'
  }, {
    title: 'Exhalation',
    href: 'https://www.amazon.com/Exhalation-Stories-Ted-Chiang-ebook/dp/B07GD46PQZ'
  }, {
    title: 'The Pisces',
    href: 'https://www.amazon.com/Pisces-Novel-Melissa-Broder-ebook/dp/B074LVLHF2'
  }, {
    title: 'Man\'s Search for Meaning (audio)',
    href: 'https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/0807014273'
  }, {
    title: 'Principles (audio)',
    href: 'https://www.amazon.com/Simon-Schuster-Audio-Principles-Life/dp/B074B2CZJG'
  }, {
    title: 'How to Change Your Mind',
    href: 'https://www.amazon.com/Change-Your-Mind-Consciousness-Transcendence/dp/B07B1V3RF5'
  }];
};

var amReading = function amReading() {
  return [{
    title: 'Killing Commendatore',
    href: 'https://www.amazon.com/dp/B079WM2HMV'
  }, {
    title: 'Shrinks (audio)',
    href: 'https://www.amazon.com/dp/B00LLIJ0OC'
  }, {
    title: 'Adaptive Markets (audio)',
    href: 'https://www.amazon.com/Adaptive-Markets-Financial-Evolution-Thought-ebook/dp/B07R4C6PDZ'
  }, {
    title: 'Vagabonding: An Uncommon Guide to the Art of Long-Term World Travel',
    href: 'https://www.amazon.com/Vagabonding-Uncommon-Guide-Long-Term-Travel-ebook/dp/B000FBFMKM'
  }];
};

var planneingToRead = function planneingToRead() {
  return [{
    title: 'Barbarian Days',
    href: 'https://www.amazon.com/dp/B00G3L6JMS'
  }, {
    title: 'Radical Acceptance',
    href: 'https://www.amazon.com/Radical-Acceptance-Tara-Brach-ebook/dp/B000FC2NHG'
  }, {
    title: 'Good Profit',
    href: 'https://www.amazon.com/Good-Profit-Creating-Successful-Companies-ebook/dp/B00TWEMGE8'
  }, {
    title: 'The Coming Anarchy',
    href: 'https://www.theatlantic.com/magazine/archive/1994/02/the-coming-anarchy/304670/'
  }, {
    title: 'The Long Boom: A History of the Future, 1980–2020',
    href: 'https://www.wired.com/1997/07/longboom/'
  }, {
    title: 'Sources of the Self: The Making of the Modern Identity',
    href: 'https://www.amazon.com/Sources-Self-Making-Modern-Identity/dp/0674824261'
  }];
};

var Books = function Books() {
  return __jsx("div", {
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, __jsx(next_head__WEBPACK_IMPORTED_MODULE_3___default.a, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, __jsx("title", {
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, "Books"), __jsx("link", {
    rel: "icon",
    href: "/favicon.ico",
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }), __jsx("link", {
    rel: "stylesheet",
    href: "https://unpkg.com/purecss@1.0.1/build/pure-min.css",
    integrity: "sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47",
    crossorigin: "anonymous",
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }), __jsx("link", {
    href: "https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap",
    rel: "stylesheet",
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  })), Object(_components_nav__WEBPACK_IMPORTED_MODULE_4__["default"])(true), __jsx("div", {
    className: "jsx-3955433960" + " " + "hero",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, __jsx("div", {
    className: "jsx-3955433960" + " " + "row",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, __jsx("div", {
    className: "jsx-3955433960" + " " + "pure-g",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: this
  }, __jsx("h1", {
    className: "jsx-3955433960" + " " + "title",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, "Books"), __jsx("div", {
    className: "jsx-3955433960" + " " + "pure-u-1-1",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, __jsx("div", {
    className: "jsx-3955433960" + " " + "row-content",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }, __jsx("p", {
    className: "jsx-3955433960" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, "Here you can find what I've read and am currently reading, this list starts from the year 2020."), __jsx("div", {
    className: "jsx-3955433960" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, __jsx("input", {
    id: "cb",
    type: "checkbox",
    checked: true,
    disabled: true,
    readOnly: true,
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }), "Disabled grey boxes indicate books I've finished"), __jsx("div", {
    className: "jsx-3955433960" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, __jsx("input", {
    id: "cb",
    type: "checkbox",
    checked: true,
    readOnly: true,
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  }), "Checked white boxes indicate books I'm currently reading"), __jsx("div", {
    className: "jsx-3955433960" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }, __jsx("input", {
    id: "cb",
    type: "checkbox",
    readOnly: true,
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    },
    __self: this
  }), "Unchecked white boxes indicate books I hope to read soon"), __jsx("ul", {
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, __jsx("li", {
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67
    },
    __self: this
  }, __jsx("a", {
    className: "jsx-3955433960",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, "2020"))), __jsx("ul", {
    className: "jsx-3955433960" + " " + "pure-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }, haveRead().map(function (book, inx) {
    return __jsx("li", {
      key: inx,
      className: "jsx-3955433960" + " " + "card-grey",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 74
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-3955433960" + " " + "book-title pure-u-7-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 75
      },
      __self: this
    }, __jsx("input", {
      id: "cb",
      type: "checkbox",
      checked: true,
      disabled: true,
      readOnly: true,
      className: "jsx-3955433960",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 76
      },
      __self: this
    }), book.title), __jsx("div", {
      className: "jsx-3955433960" + " " + "read pure-u-1-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 79
      },
      __self: this
    }, __jsx("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: book.href,
      className: "jsx-3955433960",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 80
      },
      __self: this
    }, "Read")));
  }), amReading().map(function (book, inx) {
    return __jsx("li", {
      key: inx,
      className: "jsx-3955433960" + " " + "card",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 87
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-3955433960" + " " + "book-title pure-u-7-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 88
      },
      __self: this
    }, __jsx("input", {
      id: "cb",
      type: "checkbox",
      checked: true,
      readOnly: true,
      className: "jsx-3955433960",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 89
      },
      __self: this
    }), book.title), __jsx("div", {
      className: "jsx-3955433960" + " " + "read pure-u-1-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 92
      },
      __self: this
    }, __jsx("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: book.href,
      className: "jsx-3955433960",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 93
      },
      __self: this
    }, "Read")));
  }), planneingToRead().map(function (book, inx) {
    return __jsx("li", {
      key: inx,
      className: "jsx-3955433960" + " " + "card",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 100
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-3955433960" + " " + "book-title pure-u-7-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 101
      },
      __self: this
    }, __jsx("input", {
      id: "cb",
      type: "checkbox",
      readOnly: true,
      className: "jsx-3955433960",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 102
      },
      __self: this
    }), book.title), __jsx("div", {
      className: "jsx-3955433960" + " " + "read pure-u-1-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 105
      },
      __self: this
    }, __jsx("button", {
      className: "jsx-3955433960",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 106
      },
      __self: this
    }, __jsx("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: book.href,
      className: "jsx-3955433960",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 107
      },
      __self: this
    }, "Read"))));
  }))))))), __jsx(styled_jsx_style__WEBPACK_IMPORTED_MODULE_0___default.a, {
    id: "3955433960",
    __self: this
  }, "html.jsx-3955433960,button.jsx-3955433960,input.jsx-3955433960,select.jsx-3955433960,textarea.jsx-3955433960,.pure-g.jsx-3955433960 [class *= \"pure-u\"].jsx-3955433960{font-family:'Roboto Mono',monospace;}.hero.jsx-3955433960{width:100%;color:#333;}.title.jsx-3955433960{margin:0;width:100%;padding-top:80px;line-height:1.15;font-size:30px;text-align:center;font-family:'Roboto Mono',serif;-webkit-letter-spacing:0px;-moz-letter-spacing:0px;-ms-letter-spacing:0px;letter-spacing:0px;}.description.jsx-3955433960{text-align:left;font-family:'Roboto Mono',monospace;}.row.jsx-3955433960{max-width:880px;margin:20px auto 40px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:space-around;-webkit-justify-content:space-around;-ms-flex-pack:space-around;justify-content:space-around;}.card.jsx-3955433960{padding:9px 9px 12px;text-align:left;-webkit-text-decoration:none;text-decoration:none;color:#434343;border:1px solid #9b9b9b;}.card-grey.jsx-3955433960{padding:9px 9px 9px;text-align:left;-webkit-text-decoration:none;text-decoration:none;background-color:#F0F0F0;border:1px solid #9b9b9b;}.card.jsx-3955433960:hover{border-color:#067df7;}.card-grey.jsx-3955433960:hover{border-color:#067df7;}.card.jsx-3955433960 h3.jsx-3955433960{margin:0;color:#067df7;font-size:18px;}.card.jsx-3955433960 p.jsx-3955433960{margin:0;padding:12px 0 0;font-size:13px;color:#333;}ul.jsx-3955433960{padding-left:0px;}li.jsx-3955433960{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;font-family:'Roboto Mono',monospace;}input.jsx-3955433960{float:left;margin-top:5px;margin-right:20px;}a.jsx-3955433960{color:#067df7;-webkit-text-decoration:none;text-decoration:none;font-size:20px;}.book-title.jsx-3955433960{width:100%;}.read.jsx-3955433960{display:inline-block;margin-left:auto;margin-right:0;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kcmV3c3RvbmUvY29kZS9teWJsb2cvcGFnZXMvYm9va3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBdUhnQixBQUlnRCxBQUc1QixBQUlGLEFBVU8sQUFJQSxBQU9LLEFBT0QsQUFPQyxBQUdBLEFBR1osQUFLQSxBQU1RLEFBR0osQUFJRixBQUtHLEFBS0gsQUFHVSxTQXZFVixBQXlDRyxBQUtHLEVBbEROLEFBK0RJLEFBVWpCLEdBTHVCLEVBdERnQixBQUlmLENBc0N4QixHQW5EbUIsQUEyQkQsQ0FQQSxBQWNsQixBQUdBLEFBa0NrQixDQTNFbEIsQ0E2Q2lCLEdBS0EsQUFhRyxVQW5FcEIsQUFvQ3VCLENBM0JKLEFBb0JJLENBUFIsQUE0QmYsQUE4QmdCLEdBekJILEdBYWIsUUFsREEsQUFzQ0EsQ0F5QkEsQ0F2RWlCLFVBOERBLEtBN0RHLEtBbURtQixLQVd2QyxPQXBDMkIsQ0F6QlEsQUFrQm5CLGNBQ1csU0FnQzNCLENBekIyQixDQWZOLE9BVkEsT0FtQnJCLFVBT0EsNkNBZitCLCtCQVYvQiw0RkFXQSIsImZpbGUiOiIvVXNlcnMvZHJld3N0b25lL2NvZGUvbXlibG9nL3BhZ2VzL2Jvb2tzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZldGNoIGZyb20gJ2lzb21vcnBoaWMtdW5mZXRjaCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEhlYWQgZnJvbSAnbmV4dC9oZWFkJztcbmltcG9ydCBOYXYgZnJvbSAnLi4vLi4vY29tcG9uZW50cy9uYXYnO1xuXG5jb25zdCBoYXZlUmVhZCA9ICgpID0+IChbXG4gIHsgdGl0bGU6ICdXaWxkIFNoZWVwIENoYXNlJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vV2lsZC1TaGVlcC1DaGFzZS1Ob3ZlbC9kcC8wMzc1NzE4OTRYJyB9LFxuICB7IHRpdGxlOiAnVGhlIEpldyBpbiB0aGUgTG90dXM6IEEgUG9ldFxcJ3MgUmVkaXNjb3Zlcnkgb2YgSmV3aXNoIElkZW50aXR5IGluIEJ1ZGRoaXN0IEluZGlhJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vSmV3LUxvdHVzLVJlZGlzY292ZXJ5LUlkZW50aXR5LUJ1ZGRoaXN0LWVib29rL2RwL0IwMDBaNEpRTlMnIH0sXG4gIHsgdGl0bGU6ICdKb3lmdWwgV2lzZG9tJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vSm95ZnVsLVdpc2RvbS1FbWJyYWNpbmctRmluZGluZy1GcmVlZG9tL2RwL0IwMDI2MlVBWVEnIH0sXG4gIHsgdGl0bGU6ICdXaGF0IEkgVGFsayBBYm91dCBXaGVuIEkgVGFsayBBYm91dCBSdW5uaW5nJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vV2hhdC1UYWxrLUFib3V0LVdoZW4tUnVubmluZy9kcC8wMzA3Mzg5ODM5JyB9LFxuICB7IHRpdGxlOiAnRXhoYWxhdGlvbicsIGhyZWY6ICdodHRwczovL3d3dy5hbWF6b24uY29tL0V4aGFsYXRpb24tU3Rvcmllcy1UZWQtQ2hpYW5nLWVib29rL2RwL0IwN0dENDZQUVonIH0sXG4gIHsgdGl0bGU6ICdUaGUgUGlzY2VzJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vUGlzY2VzLU5vdmVsLU1lbGlzc2EtQnJvZGVyLWVib29rL2RwL0IwNzRMVkxIRjInIH0sXG4gIHsgdGl0bGU6ICdNYW5cXCdzIFNlYXJjaCBmb3IgTWVhbmluZyAoYXVkaW8pJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vTWFucy1TZWFyY2gtTWVhbmluZy1WaWt0b3ItRnJhbmtsL2RwLzA4MDcwMTQyNzMnIH0sXG4gIHsgdGl0bGU6ICdQcmluY2lwbGVzIChhdWRpbyknLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9TaW1vbi1TY2h1c3Rlci1BdWRpby1QcmluY2lwbGVzLUxpZmUvZHAvQjA3NEIyQ1pKRycgfSxcbiAgeyB0aXRsZTogJ0hvdyB0byBDaGFuZ2UgWW91ciBNaW5kJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vQ2hhbmdlLVlvdXItTWluZC1Db25zY2lvdXNuZXNzLVRyYW5zY2VuZGVuY2UvZHAvQjA3QjFWM1JGNScgfSxcbl0pXG5cbmNvbnN0IGFtUmVhZGluZyA9ICgpID0+IChbXG4gIHsgdGl0bGU6ICdLaWxsaW5nIENvbW1lbmRhdG9yZScsIGhyZWY6ICdodHRwczovL3d3dy5hbWF6b24uY29tL2RwL0IwNzlXTTJITVYnIH0sXG4gIHsgdGl0bGU6ICdTaHJpbmtzIChhdWRpbyknLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9kcC9CMDBMTElKME9DJyB9LFxuICB7IHRpdGxlOiAnQWRhcHRpdmUgTWFya2V0cyAoYXVkaW8pJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vQWRhcHRpdmUtTWFya2V0cy1GaW5hbmNpYWwtRXZvbHV0aW9uLVRob3VnaHQtZWJvb2svZHAvQjA3UjRDNlBEWicgfSxcbiAgeyB0aXRsZTogJ1ZhZ2Fib25kaW5nOiBBbiBVbmNvbW1vbiBHdWlkZSB0byB0aGUgQXJ0IG9mIExvbmctVGVybSBXb3JsZCBUcmF2ZWwnLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9WYWdhYm9uZGluZy1VbmNvbW1vbi1HdWlkZS1Mb25nLVRlcm0tVHJhdmVsLWVib29rL2RwL0IwMDBGQkZNS00nIH0sXG5dKTtcblxuY29uc3QgcGxhbm5laW5nVG9SZWFkID0gKCkgPT4gKFtcbiAgeyB0aXRsZTogJ0JhcmJhcmlhbiBEYXlzJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vZHAvQjAwRzNMNkpNUycgfSxcbiAgeyB0aXRsZTogJ1JhZGljYWwgQWNjZXB0YW5jZScsIGhyZWY6ICdodHRwczovL3d3dy5hbWF6b24uY29tL1JhZGljYWwtQWNjZXB0YW5jZS1UYXJhLUJyYWNoLWVib29rL2RwL0IwMDBGQzJOSEcnIH0sXG4gIHsgdGl0bGU6ICdHb29kIFByb2ZpdCcsIGhyZWY6ICdodHRwczovL3d3dy5hbWF6b24uY29tL0dvb2QtUHJvZml0LUNyZWF0aW5nLVN1Y2Nlc3NmdWwtQ29tcGFuaWVzLWVib29rL2RwL0IwMFRXRU1HRTgnIH0sXG4gIHsgdGl0bGU6ICdUaGUgQ29taW5nIEFuYXJjaHknLCBocmVmOiAnaHR0cHM6Ly93d3cudGhlYXRsYW50aWMuY29tL21hZ2F6aW5lL2FyY2hpdmUvMTk5NC8wMi90aGUtY29taW5nLWFuYXJjaHkvMzA0NjcwLycgfSxcbiAgeyB0aXRsZTogJ1RoZSBMb25nIEJvb206IEEgSGlzdG9yeSBvZiB0aGUgRnV0dXJlLCAxOTgw4oCTMjAyMCcsIGhyZWY6ICdodHRwczovL3d3dy53aXJlZC5jb20vMTk5Ny8wNy9sb25nYm9vbS8nIH0sXG4gIHsgdGl0bGU6ICdTb3VyY2VzIG9mIHRoZSBTZWxmOiBUaGUgTWFraW5nIG9mIHRoZSBNb2Rlcm4gSWRlbnRpdHknLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9Tb3VyY2VzLVNlbGYtTWFraW5nLU1vZGVybi1JZGVudGl0eS9kcC8wNjc0ODI0MjYxJyB9XG5dKTtcblxuY29uc3QgQm9va3MgPSAoKSA9PiAoXG4gIDxkaXY+XG4gICAgPEhlYWQ+XG4gICAgICA8dGl0bGU+Qm9va3M8L3RpdGxlPlxuICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIGhyZWY9XCIvZmF2aWNvbi5pY29cIiAvPlxuICAgICAgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCJodHRwczovL3VucGtnLmNvbS9wdXJlY3NzQDEuMC4xL2J1aWxkL3B1cmUtbWluLmNzc1wiXG4gICAgICAgIGludGVncml0eT1cInNoYTM4NC1vQU94UVI2RGtDb01saUloOHlGbnUyNWQ3RXEvUEhTMjFQQ2xwd2pPVGVVMmpSU3ExMXZ1NjZyZjkwL2NacjQ3XCJcbiAgICAgICAgY3Jvc3NvcmlnaW49XCJhbm9ueW1vdXNcIiAvPlxuICAgICAgPGxpbmsgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1Sb2JvdG8rTW9ubzo0MDAsNTAwJmRpc3BsYXk9c3dhcFwiIHJlbD1cInN0eWxlc2hlZXRcIiAvPlxuICAgIDwvSGVhZD5cbiAgICB7IE5hdih0cnVlKSB9XG4gICAgPGRpdiBjbGFzc05hbWU9XCJoZXJvXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1cmUtZ1wiPlxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0aXRsZVwiPkJvb2tzPC9oMT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB1cmUtdS0xLTFcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93LWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICBIZXJlIHlvdSBjYW4gZmluZCB3aGF0IEkndmUgcmVhZCBhbmQgYW0gY3VycmVudGx5IHJlYWRpbmcsIHRoaXMgbGlzdCBzdGFydHMgZnJvbSB0aGUgeWVhciAyMDIwLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjYlwiIHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3RydWV9IGRpc2FibGVkIHJlYWRPbmx5Lz5cbiAgICAgICAgICAgICAgICBEaXNhYmxlZCBncmV5IGJveGVzIGluZGljYXRlIGJvb2tzIEkndmUgZmluaXNoZWRcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjYlwiIHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3RydWV9IHJlYWRPbmx5Lz5cbiAgICAgICAgICAgICAgICBDaGVja2VkIHdoaXRlIGJveGVzIGluZGljYXRlIGJvb2tzIEknbSBjdXJyZW50bHkgcmVhZGluZ1xuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNiXCIgdHlwZT1cImNoZWNrYm94XCIgcmVhZE9ubHkvPlxuICAgICAgICAgICAgICAgIFVuY2hlY2tlZCB3aGl0ZSBib3hlcyBpbmRpY2F0ZSBib29rcyBJIGhvcGUgdG8gcmVhZCBzb29uXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgPGE+MjAyMDwvYT5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwicHVyZS1jb250cm9sc1wiPlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGhhdmVSZWFkKCkubWFwKChib29rLCBpbngpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT17XCJjYXJkLWdyZXlcIn0ga2V5PXtpbnh9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9vay10aXRsZSBwdXJlLXUtNy04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY2JcIiB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXt0cnVlfSBkaXNhYmxlZCByZWFkT25seS8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Ym9vay50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlYWQgcHVyZS11LTEtOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiIGhyZWY9e2Jvb2suaHJlZn0+UmVhZDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGFtUmVhZGluZygpLm1hcCgoYm9vaywgaW54KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJjYXJkXCIga2V5PXtpbnh9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9vay10aXRsZSBwdXJlLXUtNy04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY2JcIiB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXt0cnVlfSByZWFkT25seS8+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Ym9vay50aXRsZX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlYWQgcHVyZS11LTEtOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiIGhyZWY9e2Jvb2suaHJlZn0+UmVhZDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHBsYW5uZWluZ1RvUmVhZCgpLm1hcCgoYm9vaywgaW54KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzc05hbWU9XCJjYXJkXCIga2V5PXtpbnh9PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9vay10aXRsZSBwdXJlLXUtNy04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjYlwiIHR5cGU9XCJjaGVja2JveFwiIHJlYWRPbmx5Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtib29rLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVhZCBwdXJlLXUtMS04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8YSB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCIgaHJlZj17Ym9vay5ocmVmfT5SZWFkPC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPHN0eWxlIGpzeD57YFxuICAgICAgaHRtbCwgYnV0dG9uLCBpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYSxcbiAgICAgIC5wdXJlLWcgW2NsYXNzICo9IFwicHVyZS11XCJdIHtcbiAgICAgICAgICBmb250LWZhbWlseTogJ1JvYm90byBNb25vJywgbW9ub3NwYWNlO1xuICAgICAgfVxuICAgICAgLmhlcm8ge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgY29sb3I6ICMzMzM7XG4gICAgICB9XG4gICAgICAudGl0bGUge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nLXRvcDogODBweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTU7XG4gICAgICAgIGZvbnQtc2l6ZTogMzBweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBmb250LWZhbWlseTogJ1JvYm90byBNb25vJywgc2VyaWY7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwcHg7XG4gICAgICB9XG4gICAgICAuZGVzY3JpcHRpb24ge1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICBmb250LWZhbWlseTogJ1JvYm90byBNb25vJywgbW9ub3NwYWNlO1xuICAgICAgfVxuICAgICAgLnJvdyB7XG4gICAgICAgIG1heC13aWR0aDogODgwcHg7XG4gICAgICAgIG1hcmdpbjogMjBweCBhdXRvIDQwcHg7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuICAgICAgfVxuICAgICAgLmNhcmQge1xuICAgICAgICBwYWRkaW5nOiA5cHggOXB4IDEycHg7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgY29sb3I6ICM0MzQzNDM7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICM5YjliOWI7XG4gICAgICB9XG4gICAgICAuY2FyZC1ncmV5IHtcbiAgICAgICAgcGFkZGluZzogOXB4IDlweCA5cHg7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI0YwRjBGMDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgIzliOWI5YjtcbiAgICAgIH1cbiAgICAgIC5jYXJkOmhvdmVyIHtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAjMDY3ZGY3O1xuICAgICAgfVxuICAgICAgLmNhcmQtZ3JleTpob3ZlciB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogIzA2N2RmNztcbiAgICAgIH1cbiAgICAgIC5jYXJkIGgzIHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogIzA2N2RmNztcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgfVxuICAgICAgLmNhcmQgcCB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgcGFkZGluZzogMTJweCAwIDA7XG4gICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgICAgY29sb3I6ICMzMzM7XG4gICAgICB9XG4gICAgICB1bCB7XG4gICAgICAgIHBhZGRpbmctbGVmdDogMHB4O1xuICAgICAgfVxuICAgICAgbGkge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmb250LWZhbWlseTogJ1JvYm90byBNb25vJywgbW9ub3NwYWNlO1xuICAgICAgfVxuICAgICAgaW5wdXQge1xuICAgICAgICBmbG9hdDogbGVmdDtcbiAgICAgICAgbWFyZ2luLXRvcDogNXB4O1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gICAgICB9XG4gICAgICBhIHtcbiAgICAgICAgY29sb3I6ICMwNjdkZjc7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgfVxuICAgICAgLmJvb2stdGl0bGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgIH1cbiAgICAgIC5yZWFkIHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICBtYXJnaW4tbGVmdDphdXRvO1xuICAgICAgICBtYXJnaW4tcmlnaHQ6MDtcbiAgICAgIH1cbiAgICBgfTwvc3R5bGU+XG4gIDwvZGl2PlxuKVxuXG5leHBvcnQgZGVmYXVsdCBCb29rc1xuIl19 */\n/*@ sourceURL=/Users/drewstone/code/myblog/pages/books/index.js */"));
};

/* harmony default export */ __webpack_exports__["default"] = (Books);

/***/ })

})
//# sourceMappingURL=books.js.9dcb8fbc728c493250cf.hot-update.js.map