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
    className: "jsx-4230806234",
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
    className: "jsx-4230806234",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, "Books"), __jsx("link", {
    rel: "icon",
    href: "/favicon.ico",
    className: "jsx-4230806234",
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
    className: "jsx-4230806234",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }), __jsx("link", {
    href: "https://fonts.googleapis.com/css?family=Roboto+Mono:400,500&display=swap",
    rel: "stylesheet",
    className: "jsx-4230806234",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  })), Object(_components_nav__WEBPACK_IMPORTED_MODULE_4__["default"])(true), __jsx("div", {
    className: "jsx-4230806234" + " " + "hero",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, __jsx("div", {
    className: "jsx-4230806234" + " " + "row",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, __jsx("div", {
    className: "jsx-4230806234" + " " + "pure-g",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: this
  }, __jsx("h1", {
    className: "jsx-4230806234" + " " + "title",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, "Books"), __jsx("div", {
    className: "jsx-4230806234" + " " + "pure-u-1-1",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, __jsx("div", {
    className: "jsx-4230806234" + " " + "row-content",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }, __jsx("p", {
    className: "jsx-4230806234" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, "Here you can find what I've read and am currently reading, this list starts from the year 2020."), __jsx("div", {
    className: "jsx-4230806234" + " " + "description",
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
    className: "jsx-4230806234",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }), "Disabled grey boxes indicate books I've finished"), __jsx("div", {
    className: "jsx-4230806234" + " " + "description",
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
    className: "jsx-4230806234",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
    },
    __self: this
  }), "Checked white boxes indicate books I'm currently reading"), __jsx("div", {
    className: "jsx-4230806234" + " " + "description",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }, __jsx("input", {
    id: "cb",
    type: "checkbox",
    readOnly: true,
    className: "jsx-4230806234",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    },
    __self: this
  }), "Unchecked white boxes indicate books I hope to read soon"), __jsx("ul", {
    className: "jsx-4230806234",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, __jsx("li", {
    className: "jsx-4230806234",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 67
    },
    __self: this
  }, __jsx("a", {
    className: "jsx-4230806234",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, "2020"))), __jsx("ul", {
    className: "jsx-4230806234" + " " + "pure-controls",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }, haveRead().map(function (book, inx) {
    return __jsx("li", {
      key: inx,
      className: "jsx-4230806234" + " " + "card-grey",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 74
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-4230806234" + " " + "book-title pure-u-7-8",
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
      className: "jsx-4230806234",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 76
      },
      __self: this
    }), book.title), __jsx("div", {
      className: "jsx-4230806234" + " " + "pure-u-1-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 79
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-4230806234" + " " + "read-link",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 80
      },
      __self: this
    }, __jsx("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: book.href,
      className: "jsx-4230806234",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 81
      },
      __self: this
    }, "Read"))));
  }), amReading().map(function (book, inx) {
    return __jsx("li", {
      key: inx,
      className: "jsx-4230806234" + " " + "card",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 89
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-4230806234" + " " + "book-title pure-u-7-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 90
      },
      __self: this
    }, __jsx("input", {
      id: "cb",
      type: "checkbox",
      checked: true,
      readOnly: true,
      className: "jsx-4230806234",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 91
      },
      __self: this
    }), book.title), __jsx("div", {
      className: "jsx-4230806234" + " " + "pure-u-1-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 94
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-4230806234" + " " + "read-link",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 95
      },
      __self: this
    }, __jsx("center", {
      className: "jsx-4230806234",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 96
      },
      __self: this
    }, __jsx("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: book.href,
      className: "jsx-4230806234",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 96
      },
      __self: this
    }, "Read")))));
  }), planneingToRead().map(function (book, inx) {
    return __jsx("li", {
      key: inx,
      className: "jsx-4230806234" + " " + "card",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 104
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-4230806234" + " " + "book-title pure-u-7-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 105
      },
      __self: this
    }, __jsx("input", {
      id: "cb",
      type: "checkbox",
      readOnly: true,
      className: "jsx-4230806234",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 106
      },
      __self: this
    }), book.title), __jsx("div", {
      className: "jsx-4230806234" + " " + "pure-u-1-8",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 109
      },
      __self: this
    }, __jsx("div", {
      className: "jsx-4230806234" + " " + "read-link",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 110
      },
      __self: this
    }, __jsx("center", {
      className: "jsx-4230806234",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 111
      },
      __self: this
    }, __jsx("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: book.href,
      className: "jsx-4230806234",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 111
      },
      __self: this
    }, "Read")))));
  }))))))), __jsx(styled_jsx_style__WEBPACK_IMPORTED_MODULE_0___default.a, {
    id: "4230806234",
    __self: this
  }, "html.jsx-4230806234,button.jsx-4230806234,input.jsx-4230806234,select.jsx-4230806234,textarea.jsx-4230806234,.pure-g.jsx-4230806234 [class *= \"pure-u\"].jsx-4230806234{font-family:'Roboto Mono',monospace;}.hero.jsx-4230806234{width:100%;color:#333;}.title.jsx-4230806234{margin:0;width:100%;padding-top:80px;line-height:1.15;font-size:30px;text-align:center;font-family:'Roboto Mono',serif;-webkit-letter-spacing:0px;-moz-letter-spacing:0px;-ms-letter-spacing:0px;letter-spacing:0px;}.description.jsx-4230806234{text-align:left;font-family:'Roboto Mono',monospace;}.row.jsx-4230806234{max-width:880px;margin:20px auto 40px;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:space-around;-webkit-justify-content:space-around;-ms-flex-pack:space-around;justify-content:space-around;}.row-content.jsx-4230806234{margin:0 0.5rem;}.card.jsx-4230806234{padding:9px 9px 12px;text-align:left;-webkit-text-decoration:none;text-decoration:none;color:#434343;border:1px solid #9b9b9b;}.card-grey.jsx-4230806234{padding:9px 9px 9px;text-align:left;-webkit-text-decoration:none;text-decoration:none;background-color:#F0F0F0;border:1px solid #9b9b9b;}.card.jsx-4230806234:hover{border-color:#067df7;}.card-grey.jsx-4230806234:hover{border-color:#067df7;}.card.jsx-4230806234 h3.jsx-4230806234{margin:0;color:#067df7;font-size:18px;}.card.jsx-4230806234 p.jsx-4230806234{margin:0;padding:12px 0 0;font-size:13px;color:#333;}ul.jsx-4230806234{padding-left:0px;}li.jsx-4230806234{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;font-family:'Roboto Mono',monospace;}input.jsx-4230806234{float:left;margin-top:5px;margin-right:20px;}a.jsx-4230806234{color:#067df7;-webkit-text-decoration:none;text-decoration:none;font-size:20px;}.book-title.jsx-4230806234{width:100%;}.read.jsx-4230806234{background-color:blue;}.read-link.jsx-4230806234{margin:-5px;border:thick solid #0000FF;border-radius:25px;font-size:12px;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kcmV3c3RvbmUvY29kZS9teWJsb2cvcGFnZXMvYm9va3MvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBMkhnQixBQUlnRCxBQUc1QixBQUlGLEFBVU8sQUFJQSxBQU9BLEFBR0ssQUFPRCxBQU9DLEFBR0EsQUFHWixBQUtBLEFBTVEsQUFHSixBQUlGLEFBS0csQUFLSCxBQUdXLEFBR1YsU0E3RUQsQUE0Q0csQUFLRyxFQXJETixBQWtFSSxBQVVqQixDQU02QixFQVhOLEVBekRnQixBQUlmLEFBT3hCLENBa0NBLEdBdERtQixBQThCRCxDQVBBLEFBY2xCLEFBR0EsQ0E1Q0EsQUE4RUEsQ0E5QmlCLEdBS0EsQUFhRyxVQXRFcEIsQUF1Q3VCLENBOUJKLEFBdUJJLENBVlIsQUErQmYsQ0FpQ3FCLEVBNUJSLEdBYWIsUUFyREEsQUF5Q0EsRUFqRGlCLElBNkVBLE1BWkEsS0FoRUcsSUE2RXBCLENBdkJ1QyxLQVd2QyxPQXBDMkIsQ0E1QlEsQUFxQm5CLGNBQ1csU0FnQzNCLENBekIyQixDQWxCTixPQVZBLE9Bc0JyQixVQU9BLDZDQWxCK0IsK0JBVi9CLDRGQVdBIiwiZmlsZSI6Ii9Vc2Vycy9kcmV3c3RvbmUvY29kZS9teWJsb2cvcGFnZXMvYm9va3MvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZmV0Y2ggZnJvbSAnaXNvbW9ycGhpYy11bmZldGNoJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IE5hdiBmcm9tICcuLi8uLi9jb21wb25lbnRzL25hdic7XG5cbmNvbnN0IGhhdmVSZWFkID0gKCkgPT4gKFtcbiAgeyB0aXRsZTogJ1dpbGQgU2hlZXAgQ2hhc2UnLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9XaWxkLVNoZWVwLUNoYXNlLU5vdmVsL2RwLzAzNzU3MTg5NFgnIH0sXG4gIHsgdGl0bGU6ICdUaGUgSmV3IGluIHRoZSBMb3R1czogQSBQb2V0XFwncyBSZWRpc2NvdmVyeSBvZiBKZXdpc2ggSWRlbnRpdHkgaW4gQnVkZGhpc3QgSW5kaWEnLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9KZXctTG90dXMtUmVkaXNjb3ZlcnktSWRlbnRpdHktQnVkZGhpc3QtZWJvb2svZHAvQjAwMFo0SlFOUycgfSxcbiAgeyB0aXRsZTogJ0pveWZ1bCBXaXNkb20nLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9Kb3lmdWwtV2lzZG9tLUVtYnJhY2luZy1GaW5kaW5nLUZyZWVkb20vZHAvQjAwMjYyVUFZUScgfSxcbiAgeyB0aXRsZTogJ1doYXQgSSBUYWxrIEFib3V0IFdoZW4gSSBUYWxrIEFib3V0IFJ1bm5pbmcnLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9XaGF0LVRhbGstQWJvdXQtV2hlbi1SdW5uaW5nL2RwLzAzMDczODk4MzknIH0sXG4gIHsgdGl0bGU6ICdFeGhhbGF0aW9uJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vRXhoYWxhdGlvbi1TdG9yaWVzLVRlZC1DaGlhbmctZWJvb2svZHAvQjA3R0Q0NlBRWicgfSxcbiAgeyB0aXRsZTogJ1RoZSBQaXNjZXMnLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9QaXNjZXMtTm92ZWwtTWVsaXNzYS1Ccm9kZXItZWJvb2svZHAvQjA3NExWTEhGMicgfSxcbiAgeyB0aXRsZTogJ01hblxcJ3MgU2VhcmNoIGZvciBNZWFuaW5nIChhdWRpbyknLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9NYW5zLVNlYXJjaC1NZWFuaW5nLVZpa3Rvci1GcmFua2wvZHAvMDgwNzAxNDI3MycgfSxcbiAgeyB0aXRsZTogJ1ByaW5jaXBsZXMgKGF1ZGlvKScsIGhyZWY6ICdodHRwczovL3d3dy5hbWF6b24uY29tL1NpbW9uLVNjaHVzdGVyLUF1ZGlvLVByaW5jaXBsZXMtTGlmZS9kcC9CMDc0QjJDWkpHJyB9LFxuICB7IHRpdGxlOiAnSG93IHRvIENoYW5nZSBZb3VyIE1pbmQnLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9DaGFuZ2UtWW91ci1NaW5kLUNvbnNjaW91c25lc3MtVHJhbnNjZW5kZW5jZS9kcC9CMDdCMVYzUkY1JyB9LFxuXSlcblxuY29uc3QgYW1SZWFkaW5nID0gKCkgPT4gKFtcbiAgeyB0aXRsZTogJ0tpbGxpbmcgQ29tbWVuZGF0b3JlJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vZHAvQjA3OVdNMkhNVicgfSxcbiAgeyB0aXRsZTogJ1Nocmlua3MgKGF1ZGlvKScsIGhyZWY6ICdodHRwczovL3d3dy5hbWF6b24uY29tL2RwL0IwMExMSUowT0MnIH0sXG4gIHsgdGl0bGU6ICdBZGFwdGl2ZSBNYXJrZXRzIChhdWRpbyknLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9BZGFwdGl2ZS1NYXJrZXRzLUZpbmFuY2lhbC1Fdm9sdXRpb24tVGhvdWdodC1lYm9vay9kcC9CMDdSNEM2UERaJyB9LFxuICB7IHRpdGxlOiAnVmFnYWJvbmRpbmc6IEFuIFVuY29tbW9uIEd1aWRlIHRvIHRoZSBBcnQgb2YgTG9uZy1UZXJtIFdvcmxkIFRyYXZlbCcsIGhyZWY6ICdodHRwczovL3d3dy5hbWF6b24uY29tL1ZhZ2Fib25kaW5nLVVuY29tbW9uLUd1aWRlLUxvbmctVGVybS1UcmF2ZWwtZWJvb2svZHAvQjAwMEZCRk1LTScgfSxcbl0pO1xuXG5jb25zdCBwbGFubmVpbmdUb1JlYWQgPSAoKSA9PiAoW1xuICB7IHRpdGxlOiAnQmFyYmFyaWFuIERheXMnLCBocmVmOiAnaHR0cHM6Ly93d3cuYW1hem9uLmNvbS9kcC9CMDBHM0w2Sk1TJyB9LFxuICB7IHRpdGxlOiAnUmFkaWNhbCBBY2NlcHRhbmNlJywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vUmFkaWNhbC1BY2NlcHRhbmNlLVRhcmEtQnJhY2gtZWJvb2svZHAvQjAwMEZDMk5IRycgfSxcbiAgeyB0aXRsZTogJ0dvb2QgUHJvZml0JywgaHJlZjogJ2h0dHBzOi8vd3d3LmFtYXpvbi5jb20vR29vZC1Qcm9maXQtQ3JlYXRpbmctU3VjY2Vzc2Z1bC1Db21wYW5pZXMtZWJvb2svZHAvQjAwVFdFTUdFOCcgfSxcbiAgeyB0aXRsZTogJ1RoZSBDb21pbmcgQW5hcmNoeScsIGhyZWY6ICdodHRwczovL3d3dy50aGVhdGxhbnRpYy5jb20vbWFnYXppbmUvYXJjaGl2ZS8xOTk0LzAyL3RoZS1jb21pbmctYW5hcmNoeS8zMDQ2NzAvJyB9LFxuICB7IHRpdGxlOiAnVGhlIExvbmcgQm9vbTogQSBIaXN0b3J5IG9mIHRoZSBGdXR1cmUsIDE5ODDigJMyMDIwJywgaHJlZjogJ2h0dHBzOi8vd3d3LndpcmVkLmNvbS8xOTk3LzA3L2xvbmdib29tLycgfSxcbiAgeyB0aXRsZTogJ1NvdXJjZXMgb2YgdGhlIFNlbGY6IFRoZSBNYWtpbmcgb2YgdGhlIE1vZGVybiBJZGVudGl0eScsIGhyZWY6ICdodHRwczovL3d3dy5hbWF6b24uY29tL1NvdXJjZXMtU2VsZi1NYWtpbmctTW9kZXJuLUlkZW50aXR5L2RwLzA2NzQ4MjQyNjEnIH1cbl0pO1xuXG5jb25zdCBCb29rcyA9ICgpID0+IChcbiAgPGRpdj5cbiAgICA8SGVhZD5cbiAgICAgIDx0aXRsZT5Cb29rczwvdGl0bGU+XG4gICAgICA8bGluayByZWw9XCJpY29uXCIgaHJlZj1cIi9mYXZpY29uLmljb1wiIC8+XG4gICAgICA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cImh0dHBzOi8vdW5wa2cuY29tL3B1cmVjc3NAMS4wLjEvYnVpbGQvcHVyZS1taW4uY3NzXCJcbiAgICAgICAgaW50ZWdyaXR5PVwic2hhMzg0LW9BT3hRUjZEa0NvTWxpSWg4eUZudTI1ZDdFcS9QSFMyMVBDbHB3ak9UZVUyalJTcTExdnU2NnJmOTAvY1pyNDdcIlxuICAgICAgICBjcm9zc29yaWdpbj1cImFub255bW91c1wiIC8+XG4gICAgICA8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3M/ZmFtaWx5PVJvYm90bytNb25vOjQwMCw1MDAmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiIC8+XG4gICAgPC9IZWFkPlxuICAgIHsgTmF2KHRydWUpIH1cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImhlcm9cIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVyZS1nXCI+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRpdGxlXCI+Qm9va3M8L2gxPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVyZS11LTEtMVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3ctY29udGVudFwiPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIEhlcmUgeW91IGNhbiBmaW5kIHdoYXQgSSd2ZSByZWFkIGFuZCBhbSBjdXJyZW50bHkgcmVhZGluZywgdGhpcyBsaXN0IHN0YXJ0cyBmcm9tIHRoZSB5ZWFyIDIwMjAuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNiXCIgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17dHJ1ZX0gZGlzYWJsZWQgcmVhZE9ubHkvPlxuICAgICAgICAgICAgICAgIERpc2FibGVkIGdyZXkgYm94ZXMgaW5kaWNhdGUgYm9va3MgSSd2ZSBmaW5pc2hlZFxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjcmlwdGlvblwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNiXCIgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17dHJ1ZX0gcmVhZE9ubHkvPlxuICAgICAgICAgICAgICAgIENoZWNrZWQgd2hpdGUgYm94ZXMgaW5kaWNhdGUgYm9va3MgSSdtIGN1cnJlbnRseSByZWFkaW5nXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY2JcIiB0eXBlPVwiY2hlY2tib3hcIiByZWFkT25seS8+XG4gICAgICAgICAgICAgICAgVW5jaGVja2VkIHdoaXRlIGJveGVzIGluZGljYXRlIGJvb2tzIEkgaG9wZSB0byByZWFkIHNvb25cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDx1bD5cbiAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICA8YT4yMDIwPC9hPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJwdXJlLWNvbnRyb2xzXCI+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgaGF2ZVJlYWQoKS5tYXAoKGJvb2ssIGlueCkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtcImNhcmQtZ3JleVwifSBrZXk9e2lueH0+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib29rLXRpdGxlIHB1cmUtdS03LThcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjYlwiIHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3RydWV9IGRpc2FibGVkIHJlYWRPbmx5Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtib29rLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVyZS11LTEtOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWFkLWxpbmtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiIGhyZWY9e2Jvb2suaHJlZn0+UmVhZDwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgYW1SZWFkaW5nKCkubWFwKChib29rLCBpbngpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImNhcmRcIiBrZXk9e2lueH0+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib29rLXRpdGxlIHB1cmUtdS03LThcIj5cbiAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjYlwiIHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3RydWV9IHJlYWRPbmx5Lz5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtib29rLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHVyZS11LTEtOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWFkLWxpbmtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxjZW50ZXI+PGEgdGFyZ2V0PVwiX2JsYW5rXCIgcmVsPVwibm9vcGVuZXIgbm9yZWZlcnJlclwiIGhyZWY9e2Jvb2suaHJlZn0+UmVhZDwvYT48L2NlbnRlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcGxhbm5laW5nVG9SZWFkKCkubWFwKChib29rLCBpbngpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzTmFtZT1cImNhcmRcIiBrZXk9e2lueH0+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJib29rLXRpdGxlIHB1cmUtdS03LThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNiXCIgdHlwZT1cImNoZWNrYm94XCIgcmVhZE9ubHkvPlxuICAgICAgICAgICAgICAgICAgICAgICAge2Jvb2sudGl0bGV9XG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdXJlLXUtMS04XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlYWQtbGlua1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2VudGVyPjxhIHRhcmdldD1cIl9ibGFua1wiIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIiBocmVmPXtib29rLmhyZWZ9PlJlYWQ8L2E+PC9jZW50ZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8c3R5bGUganN4PntgXG4gICAgICBodG1sLCBidXR0b24sIGlucHV0LCBzZWxlY3QsIHRleHRhcmVhLFxuICAgICAgLnB1cmUtZyBbY2xhc3MgKj0gXCJwdXJlLXVcIl0ge1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvIE1vbm8nLCBtb25vc3BhY2U7XG4gICAgICB9XG4gICAgICAuaGVybyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBjb2xvcjogIzMzMztcbiAgICAgIH1cbiAgICAgIC50aXRsZSB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHBhZGRpbmctdG9wOiA4MHB4O1xuICAgICAgICBsaW5lLWhlaWdodDogMS4xNTtcbiAgICAgICAgZm9udC1zaXplOiAzMHB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvIE1vbm8nLCBzZXJpZjtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDBweDtcbiAgICAgIH1cbiAgICAgIC5kZXNjcmlwdGlvbiB7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvIE1vbm8nLCBtb25vc3BhY2U7XG4gICAgICB9XG4gICAgICAucm93IHtcbiAgICAgICAgbWF4LXdpZHRoOiA4ODBweDtcbiAgICAgICAgbWFyZ2luOiAyMHB4IGF1dG8gNDBweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgICB9XG4gICAgICAucm93LWNvbnRlbnQge1xuICAgICAgICBtYXJnaW46IDAgMC41cmVtO1xuICAgICAgfVxuICAgICAgLmNhcmQge1xuICAgICAgICBwYWRkaW5nOiA5cHggOXB4IDEycHg7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgY29sb3I6ICM0MzQzNDM7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICM5YjliOWI7XG4gICAgICB9XG4gICAgICAuY2FyZC1ncmV5IHtcbiAgICAgICAgcGFkZGluZzogOXB4IDlweCA5cHg7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI0YwRjBGMDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgIzliOWI5YjtcbiAgICAgIH1cbiAgICAgIC5jYXJkOmhvdmVyIHtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiAjMDY3ZGY3O1xuICAgICAgfVxuICAgICAgLmNhcmQtZ3JleTpob3ZlciB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogIzA2N2RmNztcbiAgICAgIH1cbiAgICAgIC5jYXJkIGgzIHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogIzA2N2RmNztcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgfVxuICAgICAgLmNhcmQgcCB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgcGFkZGluZzogMTJweCAwIDA7XG4gICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgICAgY29sb3I6ICMzMzM7XG4gICAgICB9XG4gICAgICB1bCB7XG4gICAgICAgIHBhZGRpbmctbGVmdDogMHB4O1xuICAgICAgfVxuICAgICAgbGkge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmb250LWZhbWlseTogJ1JvYm90byBNb25vJywgbW9ub3NwYWNlO1xuICAgICAgfVxuICAgICAgaW5wdXQge1xuICAgICAgICBmbG9hdDogbGVmdDtcbiAgICAgICAgbWFyZ2luLXRvcDogNXB4O1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gICAgICB9XG4gICAgICBhIHtcbiAgICAgICAgY29sb3I6ICMwNjdkZjc7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgfVxuICAgICAgLmJvb2stdGl0bGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgIH1cbiAgICAgIC5yZWFkIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogYmx1ZTtcbiAgICAgIH1cbiAgICAgIC5yZWFkLWxpbmsge1xuICAgICAgICBtYXJnaW46IC01cHg7XG4gICAgICAgIGJvcmRlcjogdGhpY2sgc29saWQgIzAwMDBGRjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjVweDtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgfVxuICAgIGB9PC9zdHlsZT5cbiAgPC9kaXY+XG4pXG5cbmV4cG9ydCBkZWZhdWx0IEJvb2tzXG4iXX0= */\n/*@ sourceURL=/Users/drewstone/code/myblog/pages/books/index.js */"));
};

/* harmony default export */ __webpack_exports__["default"] = (Books);

/***/ })

})
//# sourceMappingURL=books.js.7c3be9e72fab0ce19354.hot-update.js.map