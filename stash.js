let data,
  s_ = [];
let today, yesterday, week, monthStart, T1, T1L, T2, T2L;
let testId,
  ctxM_ = null;
let srn_ = null; // search nodes
let showUnvisited_ = null; // "show unvisited" flag
let mj_ = [
  "m_1",
  "m_2",
  "m_3",
  "m_4",
  "m_5",
  "m_6",
  "m_7",
  "m_8",
  "m_9",
  "m_10",
  "m_11",
  "m_12"
];
let lio; // lazy image observer
let p_;
let url_ = null;
let xCtx = 135;
//let wir = 0;

const _m = () => {
  //
  p_.innerHTML = "";

  _mD();

  if (data.op9) {
    for (let j = s_.length - 1; j >= 0; j--) _aN_L(s_[j], null);
  } else {
    for (let j = s_.length - 1; j >= 0; j--) _aN(s_[j], null);
  }

  let tmp = document.createElement("div");
  tmp.className = "tmpCl";
  p_.appendChild(tmp);

  br.textContent = s_.length;
  br.broj = s_.length;

  if (!s_.length) _pB();

  p_.style.display = "block";
};

const _mD = () => {
  // create today, yesterday list
  T1 = document.createElement("div");
  T1.id = "tdNode";
  T1.className = "vrClass";
  T1.style.display = "none";
  p_.appendChild(T1);
  T1.textContent = chrome.i18n.getMessage("today");

  T1L = document.createElement("div");
  T1L.id = "tdList";
  T1L.style.display = "none";
  T1L.className = "LClass";
  p_.appendChild(T1L);

  T2 = document.createElement("div");
  T2.id = "ydNode";
  T2.style.display = "none";
  T2.className = "vrClass";
  p_.appendChild(T2);
  T2.textContent = chrome.i18n.getMessage("yesterday");

  T2L = document.createElement("div");
  T2L.id = "ydList";
  T2L.style.display = "none";
  T2L.className = "LClass";
  p_.appendChild(T2L);
};

function _md(e) {
  // mouse down - stash
  if (e.button === 1) {
    //e.stopPropagation();
    e.preventDefault();
  }

  ctxM_ && ctxM_.blur();

  this.style.transform = "scale(0.97)";
  this.addEventListener("mouseleave", _ml);

  testId = this.id;
}

function _mu(e) {
  // mouse up - stash
  e.stopPropagation();
  e.preventDefault();

  this.style.transform = "scale(1)";
  this.removeEventListener("mouseleave", _ml);

  if (this.id === testId) {
    if (e.button === 0) {
      if (data.op8) {
        if (data.op2 && e.metaKey) _tO(this.u, false);
        else if (data.op1) _tO(this.u, true);
        else chrome.tabs.update({ url: this.u });
      } else {
        if (data.op2 && e.ctrlKey) _tO(this.u, false);
        else if (data.op1) _tO(this.u, true);
        else chrome.tabs.update({ url: this.u });
      }
    } else if (e.button === 1) _tO(this.u, false);
    else if (e.button === 2) {
      let tpn = this.parentNode;
      tpn.style.backgroundColor = "#BEC4E2";

      ctxM_ = document.createElement("div");
      ctxM_.className = "ctxM";
      ctxM_.u = this.u;
      ctxM_.innerHTML = `<div id="cn1" class="ctxN">${chrome.i18n.getMessage(
        "ont"
      )}</div>
			<div id="cn2" class="ctxN">${chrome.i18n.getMessage("del")}</div>`;

      let pw = p_.clientWidth,
        x = e.pageX,
        y = e.pageY,
        wih = window.innerHeight;
      if (x + xCtx > pw) x = pw - xCtx;
      if (y + 68 > wih) y = wih - 68;

      ctxM_.style.top = y + "px";
      ctxM_.style.left = x + "px";
      ctxM_.style.display = "block";

      document.body.appendChild(ctxM_);

      ctxM_.addEventListener("click", _cp);
      ctxM_.addEventListener("blur", _cb);
      ctxM_.setAttribute("tabIndex", "1");
      ctxM_.focus();
    }
  }
}

function _ml(e) {
  // mouse leave - stash
  this.style.transform = "scale(1)";
  this.removeEventListener("mouseleave", _ml);
}

function _od(e) {
  // on drop - stash
  e.stopPropagation();
  e.preventDefault();
  this.style.backgroundColor = "";

  let eData = e.dataTransfer.getData("text/html");

  let tD = document.createElement("div");
  tD.innerHTML = eData;

  let z = tD.getElementsByTagName("img")[0];
  this.style.backgroundColor = "";
  if (z && z.src) {
    let getI = this.getElementsByClassName("imgPrv")[0],
      tu = this.u;

    getI.onerror = function() {
      getI.src = "../img/def.png";
    };
    getI.onload = function() {
      if (this.naturalWidth < 100) {
        this.src = "../img/def.png";

        let ico = this.parentNode.getElementsByClassName("imgPrv_ico")[0];
        ico.src = z.src;
        ico.style.display = "block";
      }
    };

    getI.src = z.src;

    for (let j = s_.length - 1; j >= 0; j--) {
      if (s_[j].u === tu) s_[j].i = z.src;
    }

    chrome.runtime.sendMessage({ imgDrop: s_, url: tu, img_: z.src });
  }
}

function _do(e) {
  // on dragover - stash
  if (!url_) {
    e.preventDefault();
    this.style.backgroundColor = "#BEC4E2";
  }
}

function _dl(e) {
  // on drag leave - stash
  this.style.backgroundColor = "";
}

function _ds(e) {
  // on drag start - baza
  url_ = this.u;
}

function _de(e) {
  // on drag end - baza
  if (url_) {
    if (e.pageX > window.innerWidth) _tO(this.u, !!data.op7);
  }

  url_ = null;
  this.style.transform = "scale(1)";
  this.removeEventListener("mouseleave", _ml);
  //setTimeout(() => { dragUrl = null }, 200);
}

/* 	CTX MENU AND DROP-DOWN MENU*/

function _cp(e) {
  // context menu click
  if (e.button === 0) {
    if (e.target.id === "cn1") {
      _tO(this.u, false);
      this.blur();
    } else if (e.target.id === "cn2") {
      _rN(this.u);
      _spl(this.u);
      this.blur();
    }
  }
}

const _spl = a => {
  // delete single node stash array & notify other views
  let dNode;

  for (let i = s_.length - 1; i >= 0; i--) {
    if (s_[i].u === a) {
      dNode = s_.splice(i, 1);
    }
  }

  chrome.runtime.sendMessage({ delUrl: a, s: s_, d_n: dNode });

  if (!s_.length) _pB();

  if (srn_) {
    if (data.op9) srn_ = document.getElementsByClassName("stBox boxL");
    else srn_ = document.getElementsByClassName("stBox boxT");
  }
};

function _dc(e) {
  // drop-down menu click
  if (e.button === 0) {
    if (e.target.id === "d_d_02") _delAll();
    else if (e.target.id === "d_d_03") _delVis();
    else if (e.target.id === "d_d_04") _showUV();
    else if (e.target.id === "d_d_05") chrome.runtime.sendMessage({ exp: 1 });
    else if (e.target.id === "d_d_06") chrome.runtime.openOptionsPage();
    else if (e.target.id === "d_d_07")
      chrome.tabs.create({
        url:
          "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4LFHZT6R4K6CA",
        active: true
      });
    else if (e.target.id === "d_d_08") _view();
  }

  d_d.blur();
}

const _delAll = () => {
  //delete ALL - from drop down menu
  let cf = confirm(chrome.i18n.getMessage("confirm1"));

  if (cf == true) {
    s_ = [];

    br.broj = 0;
    br.textContent = 0;

    p_.innerHTML = "";
    _mD();

    chrome.runtime.sendMessage({ delAll: 1 });

    _pB();
  }
};

const _delVis = () => {
  //delete visited - from drop down menu
  let cf = confirm(chrome.i18n.getMessage("confirm2"));
  let f = 0;
  if (cf == true) {
    let vis = [];
    for (let i = s_.length - 1; i >= 0; i--) {
      if (s_[i].p) {
        vis.unshift(s_[i]);
        s_.splice(i, 1);
        f = 1;
      }
    }

    if (f) {
      p_.style.display = "none";

      chrome.runtime.sendMessage({ delVis: s_, d_v: vis });

      _m();
    }
  }
};

const _showUV = () => {
  //show unvisited - from drop down menu
  let gn,
    gl = document.getElementsByClassName("LClass");

  if (data.op9) gn = document.getElementsByClassName("stBox boxL");
  else gn = document.getElementsByClassName("stBox boxT");

  for (let i = gn.length - 1; i >= 0; i--) {
    if (gn[i].p) gn[i].parentNode.style.display = "none";
  }

  for (let k = gl.length - 1; k >= 0; k--) {
    if (!gl[k].clientHeight) {
      gl[k].style.display = "none";
      gl[k].previousSibling.style.display = "none";
    }
  }

  showUnvisited_ = 1;

  let a = document.createElement("div");
  a.className = "topB";
  top_h.appendChild(a);

  let b = document.createElement("div");
  b.className = "topBack";
  b.textContent = chrome.i18n.getMessage("back");
  a.appendChild(b);

  a.addEventListener("click", e => {
    if (e.button === 0) {
      p_.style.display = "none";

      for (let j = gn.length - 1; j >= 0; j--)
        gn[j].parentNode.style.display = "block";

      for (let h = gl.length - 1; h >= 0; h--) {
        if (gl[h].children.length) {
          gl[h].style.display = "block";
          gl[h].previousSibling.style.display = "block";
        }
      }

      b.className += " topItem_off";

      setTimeout(() => {
        p_.style.display = "block";
        a.className += " topIBg_off";
      }, 100);
      setTimeout(() => {
        top_h.removeChild(a);
      }, 500);
      showUnvisited_ = 0;
    }
  });
};

const _view = () => {
  p_.style.display = "none";

  if (data.op9) {
    data.op9 = 0;
    d_d_08.textContent = chrome.i18n.getMessage("dd8");
  } else {
    data.op9 = 1;
    d_d_08.textContent = chrome.i18n.getMessage("dd9");
  }

  _m();

  chrome.runtime.sendMessage({ d_new: data, d_new_v: 1 });
};

/************************** BLUR *****************************************/
/*************************************************************************/

function _cb() {
  // context menu blur
  let u = this.u,
    getN;

  if (data.op9) getN = document.getElementsByClassName("stBox boxL");
  else getN = document.getElementsByClassName("stBox boxT");

  this.parentNode.removeChild(this);

  ctxM_ = null;

  for (let i = getN.length - 1; i >= 0; i--) {
    if (getN[i].u === u) getN[i].parentNode.style.backgroundColor = "";
  }
}

const _mB = () => {
  // drop/flyout menu blur
  /* 	d_d.style.top = -350 + 'px'; */
  d_d.className = "menuDD menuU";
  setTimeout(() => {
    d_d.style.display = "none";
    d_d.className = "menuDD menuD";
    d_d.o = 0;
  }, 300);
};

/************************** ADD / REMOVE *****************************************/
/*******************************************************************/

const _aN = (a, b) => {
  let p;

  if (a.v > today) {
    //danas
    T1.style.display = "block";
    T1L.style.display = "block";
    p = T1L;
  } else if (a.v > yesterday) {
    // jučer
    T2.style.display = "block";
    T2L.style.display = "block";
    p = T2L;
  } else if (a.v > week) {
    // ovaj mjesec
    let getM = document.getElementById("wList");
    if (getM) p = getM;
    else {
      let aa = document.createElement("div");
      aa.id = "wNode";
      aa.className = "vrClass";
      p_.appendChild(aa);
      aa.textContent = chrome.i18n.getMessage("l7d");

      let bb = document.createElement("div");
      bb.id = "wList";
      bb.className = "LClass";
      p_.appendChild(bb);

      p = bb;
    }
  } else if (a.v > monthStart) {
    // ovaj mjesec
    let getM = document.getElementById("mList");
    if (getM) p = getM;
    else {
      let aa = document.createElement("div");
      aa.id = "mNode";
      aa.className = "vrClass";
      p_.appendChild(aa);
      aa.textContent = chrome.i18n.getMessage("early_t_m");

      let bb = document.createElement("div");
      bb.id = "mList";
      bb.className = "LClass";
      p_.appendChild(bb);

      p = bb;
    }
  } else {
    let d = new Date(a.v),
      dY = d.getFullYear(),
      dM = d.getMonth(),
      mId = dM + "_" + dY,
      getM = document.getElementById(mId + "_L");

    if (getM) p = getM;
    else {
      let aa = document.createElement("div");
      aa.id = mId;
      aa.className = "vrClass";
      p_.appendChild(aa);
      let dM = d.getMonth();
      aa.textContent = chrome.i18n.getMessage(mj_[dM]) + " " + dY;

      let bb = document.createElement("div");
      bb.id = mId + "_L";
      bb.className = "LClass";
      p_.appendChild(bb);

      p = bb;
    }
  }

  let d1 = new URL(a.u).hostname;
  if (d1.startsWith("www.")) d1 = d1.substring(4);

  let n1 = document.createElement("div");
  n1.className = "node";
  n1.style.height = "85px";
  n1.u = a.u;

  let n2 = document.createElement("div");
  n2.u = a.u;
  n2.id = a.v;
  n2.p = a.p;
  n2.t = a.t;
  n2.className = "stBox boxT";
  n1.appendChild(n2);

  let n3 = document.createElement("img");
  n3.className = "imgPrv";
  n2.appendChild(n3);

  let n3_1 = document.createElement("img");
  n3_1.className = "imgPrv_ico";
  n3_1.setAttribute(
    "style",
    "position: absolute;display: none;width: 24px;height: 24px;left: 83px;top:53px;z-index: 100;"
  );
  n2.appendChild(n3_1);

  let n4 = document.createElement("div");
  n4.className = "txtBox";
  n2.appendChild(n4);

  let n5 = document.createElement("div");
  n5.className = "ti_C";
  n5.textContent = a.t;
  n4.appendChild(n5);

  let n6 = document.createElement("div");
  n6.className = "dom_C";
  n6.textContent = d1;
  n4.appendChild(n6);

  n2.addEventListener("mousedown", _md);
  n2.addEventListener("mouseup", _mu);

  n2.addEventListener("drop", _od);
  n2.addEventListener("dragover", _do);
  n2.addEventListener("dragleave", _dl);

  if (b) {
    p_.scrollTo(0, 0);
    n3.onerror = function() {
      n3.src = "../img/def.png";
    };
    n3.onload = function() {
      if (this.naturalWidth < 100) {
        n3.src = "../img/def.png";
        n3_1.src = a.i;
        n3_1.style.display = "block";
      }
    };

    n3.src = a.i;
    n1.style.height = 0 + "px";
    p.insertBefore(n1, p.firstChild);

    let h = n1.clientHeight;
    n1.style.height = h + "px";
    n1.style.height = 85 + "px";
  } else {
    n3.setAttribute("data-src", a.i);
    n3.src = "../img/ph.png";

    p.appendChild(n1);
    lio.observe(n3);
  }

  n1.addEventListener("dragstart", _ds);
  //n1.addEventListener('dragover', e => {e.preventDefault()});
  n1.addEventListener("dragend", _de);
};

const _aN_L = (a, b) => {
  let p;

  if (a.v > today) {
    //danas
    T1.style.display = "block";
    T1L.style.display = "block";
    p = T1L;
  } else if (a.v > yesterday) {
    // jučer
    T2.style.display = "block";
    T2L.style.display = "block";
    p = T2L;
  } else if (a.v > week) {
    // ovaj mjesec
    let getM = document.getElementById("wList");
    if (getM) p = getM;
    else {
      let aa = document.createElement("div");
      aa.id = "wNode";
      aa.className = "vrClass";
      p_.appendChild(aa);
      aa.textContent = chrome.i18n.getMessage("l7d");

      let bb = document.createElement("div");
      bb.id = "wList";
      bb.className = "LClass";
      p_.appendChild(bb);

      p = bb;
    }
  } else if (a.v > monthStart) {
    // ovaj mjesec
    let getM = document.getElementById("mList");
    if (getM) p = getM;
    else {
      let aa = document.createElement("div");
      aa.id = "mNode";
      aa.className = "vrClass";
      p_.appendChild(aa);
      aa.textContent = chrome.i18n.getMessage("early_t_m");

      let bb = document.createElement("div");
      bb.id = "mList";
      bb.className = "LClass";
      p_.appendChild(bb);

      p = bb;
    }
  } else {
    let d = new Date(a.v),
      dY = d.getFullYear(),
      dM = d.getMonth(),
      mId = dM + "_" + dY,
      getM = document.getElementById(mId + "_L");

    if (getM) p = getM;
    else {
      let aa = document.createElement("div");
      aa.id = mId;
      aa.className = "vrClass";
      p_.appendChild(aa);
      let dM = d.getMonth();
      aa.textContent = chrome.i18n.getMessage(mj_[dM]) + " " + dY;

      let bb = document.createElement("div");
      bb.id = mId + "_L";
      bb.className = "LClass";
      p_.appendChild(bb);

      p = bb;
    }
  }

  /* 	let d1 = (new URL(a.u)).hostname;
	if (d1.startsWith('www.')) d1 = d1.substring(4); */

  let n1 = document.createElement("div");
  n1.className = "node";
  n1.style.height = "30px";
  n1.u = a.u;

  let n2 = document.createElement("div");
  n2.u = a.u;
  n2.id = a.v;
  n2.p = a.p;
  n2.t = a.t;
  n2.className = "stBox boxL";
  n1.appendChild(n2);

  let n3 = document.createElement("div");
  n3.className = "icon";
  n3.style.backgroundImage = "url(chrome://favicon/" + a.u + ")";
  n2.appendChild(n3);

  /* 	let n3_1 = document.createElement('img');
	n3_1.className = 'imgPrv_ico';
	n3_1.setAttribute('style','position: absolute;display: none;width: 24px;height: 24px;left: 83px;top:53px;z-index: 100;');
	n2.appendChild(n3_1); */

  let n4 = document.createElement("div");
  n4.className = "txtBox_L";
  n4.textContent = a.t;
  n2.appendChild(n4);

  n2.addEventListener("mousedown", _md);
  n2.addEventListener("mouseup", _mu);

  if (b) {
    p_.scrollTo(0, 0);

    n1.style.height = 0 + "px";
    p.insertBefore(n1, p.firstChild);

    let h = n1.clientHeight;
    n1.style.height = h + "px";
    n1.style.height = 30 + "px";
  } else p.appendChild(n1);

  n1.addEventListener("dragstart", _ds);
  n1.addEventListener("dragend", _de);
};

const _rN = a => {
  // remove single node from DOM
  let gn;

  if (data.op9) gn = document.getElementsByClassName("stBox boxL");
  else gn = document.getElementsByClassName("stBox boxT");

  for (let i = gn.length - 1; i >= 0; i--) {
    if (gn[i].u === a) {
      let p = gn[i].parentNode,
        h = p.clientHeight,
        gp = p.parentNode,
        ps = gp.previousSibling,
        a1 = ps.clientHeight,
        f = 0;
      p.style.height = h + "px";
      p.style.height = 0;

      br.broj -= 1;
      br.textContent = br.broj;

      if (gp.children.length - 1 == 0) {
        ps.style.height = a1 + "px";
        ps.style.height = 0;
        f = 1;
      }

      setTimeout(() => {
        gp.removeChild(p);

        if (f) {
          if (gp.id !== "tdList" && gp.id !== "ydList") {
            ps.parentNode.removeChild(ps);
            gp.parentNode.removeChild(gp);
          } else {
            ps.style.display = "none";
            gp.style.display = "none";
            ps.style.height = "65px";
          }
        }
      }, 300);
    }
  }

  if (srn_) {
    if (data.op9) srn_ = document.getElementsByClassName("stBox boxL");
    else srn_ = document.getElementsByClassName("stBox boxT");
  }
};

/*******************************************************************/
/*******************************************************************/

const _ref = () => {
  //refresh on new entry
  let getR = document.getElementById("bg_ref");
  if (getR) return;

  let rBg = document.createElement("div");
  rBg.id = "bg_ref";
  rBg.textContent = chrome.i18n.getMessage("ctf");

  document.body.appendChild(rBg);
  rBg.addEventListener("click", () => {
    window.location.reload();
  });
};

const _visitNode = a => {
  //update visit property for every node in DOM
  let gn;

  if (data.op9) gn = document.getElementsByClassName("stBox boxL");
  else gn = document.getElementsByClassName("stBox boxT");

  for (let i = gn.length - 1; i >= 0; i--) {
    if (gn[i].u === a) gn[i].p = 1;
  }

  //if (showUnvisited_) _ref();
};

const _pB = () => {
  // kreiraj pozadinsku sliku
  let a = document.createElement("div");
  a.id = "panelBG";
  p_.appendChild(a);
};

const _hcl = e => {
  // header click
  if (e.button === 0) {
    if (e.target.id === "tabBtn")
      chrome.tabs.create({ url: "tabGrid.html", active: !0 });
    else if (e.target.id === "searchBtn") _mS();
    else if (e.target.id === "menuBtn") {
      if (!d_d.o) {
        d_d.style.display = "block";
        d_d.o = 1;
        d_d.focus();
      }
    }
  }
};

const _tO = (a, b) => {
  // main function for opening new tab
  if (data.op6) {
    chrome.tabs.query({ currentWindow: true, active: true }, t => {
      chrome.tabs.create({ url: a, active: b, index: t[0].index + 1 });
    });
  } else chrome.tabs.create({ url: a, active: b });
};

/***************** drop-down menu click listener functions **************/

function _mS() {
  // kreira search toolbar
  let a = document.createElement("div");
  a.className = "topB";
  top_h.appendChild(a);

  let b = document.createElement("input");
  b.type = "search";
  b.placeholder = chrome.i18n.getMessage("sph");
  b.className = "hsb hsb_A";
  a.appendChild(b);

  b.addEventListener("input", _sr);
  b.addEventListener("keydown", _escSr);
  b.focus();

  a.addEventListener("click", function(e) {
    if (e.button === 0 && e.target === this) _cS(this, b);
  });

  if (data.op9) srn_ = document.getElementsByClassName("stBox boxL");
  else srn_ = document.getElementsByClassName("stBox boxT");
}

function _sr() {
  // search funkcija - pretraga
  var k = this.value.toLowerCase();

  if (this.value.length < 1) {
    for (var i = srn_.length - 1; i >= 0; i--) {
      let p = srn_[i].parentNode;
      p.style.display = "block";
      p.parentNode.style.display = "block";
      p.parentNode.previousSibling.style.display = "block";
    }
  } else if (this.value.length > 1) {
    let ctrlArr = {};

    for (var i = srn_.length - 1; i >= 0; i--) {
      let p = srn_[i].parentNode,
        txt = srn_[i].t.toLowerCase() + " " + srn_[i].u.toLowerCase();
      if (txt.includes(k)) {
        p.style.display = "block";
        ctrlArr[p.parentNode.id] = 1;
      } else p.style.display = "none";
    }

    let gl = document.getElementsByClassName("LClass");

    for (var j = gl.length - 1; j >= 0; j--) {
      if (ctrlArr[gl[j].id]) {
        gl[j].style.display = "block";
        gl[j].previousSibling.style.display = "block";
      } else {
        gl[j].style.display = "none";
        gl[j].previousSibling.style.display = "none";
      }
    }
  }
}

function _escSr(e) {
  // escape listener u search polju
  if (27 === e.keyCode) _cS(this.parentNode, this);
}

const _cS = (a, b) => {
  p_.style.display = "none";
  b.className = "hsb hsb_B";

  let gn,
    gl = document.getElementsByClassName("LClass");

  if (data.op9) gn = document.getElementsByClassName("stBox boxL");
  else gn = document.getElementsByClassName("stBox boxT");

  for (let j = gn.length - 1; j >= 0; j--)
    gn[j].parentNode.style.display = "block";

  for (let h = gl.length - 1; h >= 0; h--) {
    if (gl[h].children.length) {
      gl[h].style.display = "block";
      gl[h].previousSibling.style.display = "block";
    } else {
      gl[h].style.display = "none";
      gl[h].previousSibling.style.display = "none";
    }
  }

  setTimeout(() => {
    p_.style.display = "block";
    a.className += " topIBg_off";
  }, 100);
  setTimeout(() => {
    top_h.removeChild(a);
  }, 500);

  srn_ = null;
};

document.addEventListener("DOMContentLoaded", () => {
  var d = new Date();
  today = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  week = today - 604800000;
  yesterday = today - 86400000;
  monthStart = new Date(d.getFullYear(), d.getMonth()).getTime();

  p_ = document.getElementById("panel");

  p_.addEventListener("scroll", () => {
    ctxM_ && ctxM_.blur();
  });

  document.documentElement.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });
  top_h.addEventListener("click", _hcl);
  //window.addEventListener('resize', () => {wir = window.innerWidth});

  d_d.o = 0;
  d_d.addEventListener("blur", _mB);
  d_d.setAttribute("tabIndex", "1");
  d_d.addEventListener("click", _dc);

  let mbl2 = d_d.querySelectorAll("[data-i18n]");
  for (let p2 = mbl2.length - 1; p2 >= 0; p2--)
    mbl2[p2].textContent = chrome.i18n.getMessage(
      mbl2[p2].getAttribute("data-i18n")
    );

  lio = new IntersectionObserver(
    (en, o) => {
      en.forEach(ent => {
        if (ent.isIntersecting) {
          let lImg = ent.target;
          lImg.onerror = function() {
            lImg.src = "../img/def.png";
          };
          lImg.onload = function() {
            if (this.naturalWidth < 100) {
              this.src = "../img/def.png";

              let ico = this.parentNode.getElementsByClassName("imgPrv_ico")[0];
              ico.src = lImg.dataset.src;
              ico.style.display = "block";
            }
          };

          lImg.src = lImg.dataset.src;
          lio.unobserve(lImg);
        }
      });
    },
    {
      root: p_,
      rootMargin: "100px"
    }
  );

  chrome.storage.local.get(["s_", "data"], r => {
    (s_ = r.s_ || []), (data = r.data || []);

    let st_ = document.createElement("link");
    st_.rel = "stylesheet";
    st_.type = "text/css";

    if (data.op4) {
      st_.href = chrome.extension.getURL("/stash_.css");
      document.head.appendChild(st_);
    } else {
      st_.href = chrome.extension.getURL("/stash.css");
      document.head.appendChild(st_);
    }

    setTimeout(() => {
      top_h_bg.style.display = "block";
      top_h.style.display = "flex";
      _m();
      /* probaj ovo gore staviti*/
      data.op9 && (d_d_08.textContent = chrome.i18n.getMessage("dd9"));
    }, 200);
  });

  let tl = chrome.i18n.getUILanguage();
  if (tl === "hr") xCtx = 164;
  else if (tl === "de") xCtx = 160;
  else if (tl === "sr") xCtx = 178;
});

chrome.runtime.onMessage.addListener((m, s, r) => {
  if (m.ukloni) {
    s_ = m.s;
    _rN(m.ukloni);

    if (!s_.length) _pB();
  } else if (m.dodaj) {
    let d = new Date();
    let t1 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    if (t1 === today) {
      if (!srn_ && !showUnvisited_) {
        s_ = m.s;

        let getB = document.getElementById("panelBG");
        if (getB) p_.removeChild(getB);

        data.op9 ? _aN_L(m.dodaj, 1) : _aN(m.dodaj, 1);

        br.textContent = s_.length;
        br.broj = s_.length;
      } else _ref();
    } else _ref();
  } else if (m.vis) {
    _visitNode(m.vis);
    s_ = m.s;
  } else if (m.oImp) {
    p_.style.display = "none";

    s_ = m.oImp;
    setTimeout(_m, 200);
  } else if (m.delVis) _ref();
  // refrešaj kada stigne poruka iz drugog sidebara ili taba
  else if (m.imgDrop) {
    s_ = m.imgDrop;
    let gn = document.getElementsByClassName("stBox boxT"),
      u = m.url,
      im = m.img_;

    for (let i = gn.length - 1; i >= 0; i--) {
      if (gn[i].u === u) {
        let i1 = gn[i].getElementsByClassName("imgPrv")[0];
        i1.onerror = function() {
          getI.src = "../img/def.png";
        };
        i1.onload = function() {
          this.prentNodegetElementsByClassName("imgPrv_ico")[0];
          if (ico) this.removeChild(ico);
        };
        i1.src = im;
        i1.setAttribute("data-src", im);
      }
    }
  } else if (m.delUrl) {
    s_ = m.s;
    _rN(m.delUrl);
    if (!s_.length) _pB();
  } else if (m.delAll) {
    s_ = [];

    p_.innerHTML = "";
    _mD();

    br.broj = 0;
    br.textContent = 0;

    _pB();
  } else if (m.d_new) data = m.d_new;
  else if (m.theme) {
    if (m.theme === 2) data.op4 = 1;
    else data.op4 = 0;

    setTimeout(() => {
      let l = document.getElementsByTagName("link")[0];
      if (data.op4) l.href = chrome.extension.getURL("/stash_.css");
      else l.href = chrome.extension.getURL("/stash.css");
    }, 200);
  } else if (m.rf_) window.location.reload();
});
