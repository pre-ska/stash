var s_, data, t_;
var mj_ = [
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
let today, yesterday, week, monthStart;
let testId;
let ctxM_ = null;
let lio;
let winRes_; // win resize timeout

let wiw, //početna širina reda
  e1, // maximalno elemenata u jednom redu
  e2, // ukupna širina jednog reda
  e3; // con left

document.addEventListener("DOMContentLoaded", () => {
  var d = new Date();
  today = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  yesterday = today - 86400000;
  week = today - 604800000;
  monthStart = new Date(d.getFullYear(), d.getMonth()).getTime();

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
      root: bg,
      rootMargin: "300px"
    }
  );

  _main();

  bg.addEventListener("scroll", scr);

  document.documentElement.addEventListener("contextmenu", e => {
    e.preventDefault();
  });

  d_d.o = 0;
  d_d.addEventListener("blur", _mB);
  d_d.setAttribute("tabIndex", "1");
  d_d.addEventListener("click", _dc);

  t_ = document.getElementById("top");
  gore.addEventListener("click", _gc);

  let mbl2 = document.querySelectorAll("[data-i18n]");
  for (let p2 = mbl2.length - 1; p2 >= 0; p2--)
    mbl2[p2].textContent = chrome.i18n.getMessage(
      mbl2[p2].getAttribute("data-i18n")
    );

  t_.addEventListener("click", _topCl);
});

const _makeList = (a, b, c, d) => {
  let title = document.createElement("div");
  title.id = a;
  title.className = "vrClass";
  con.appendChild(title);
  d ? (title.textContent = c) : (title.textContent = chrome.i18n.getMessage(c));

  let list = document.createElement("div");
  list.id = b;
  list.className = "LClass";
  con.appendChild(list);
};

function _main() {
  con.innerHTML = "";

  chrome.storage.local.get(["s_", "data"], r => {
    (s_ = r.s_ || []), (data = r.data);

    wiw = window.innerWidth - 200; //početna širina reda
    e1 = Math.floor(wiw / 260); // maximalno u jednom redu
    e2 = e1 * 260; // ukupna širina jednog reda
    e3 = Math.floor((wiw - e2) / 2); // con left

    con.style.width = e2 + "px";
    con.style.left = e3 + 100 + "px";

    _go(s_);

    br.textContent = s_.length;
    br.broj = s_.length;
  });
}

const _go = stash => {
  let daysObj = {},
    daysArr = [];

  for (let i = stash.length - 1; i >= 0; i--) {
    let nc = stash[i].v;

    if (nc > today) {
      stash[i].par = "tdList";
      if (!daysObj.tdList) {
        daysObj.tdList = 0;
        daysArr[daysArr.length] = "tdList";
        _makeList("tdNode", "tdList", "today");
      }

      daysObj.tdList += 1;
    } else if (nc > yesterday) {
      stash[i].par = "ydList";
      if (!daysObj.ydList) {
        daysObj.ydList = 0;
        daysArr[daysArr.length] = "ydList";
        _makeList("ydNode", "ydList", "yesterday");
      }

      daysObj.ydList += 1;
    } else if (nc > week) {
      stash[i].par = "week";
      if (!daysObj.week) {
        daysObj.week = 0;
        daysArr[daysArr.length] = "week";
        _makeList("wNode", "week", "l7d");
      }

      daysObj.week += 1;
    } else if (nc > monthStart) {
      stash[i].par = "mList";
      if (!daysObj.mList) {
        daysObj.mList = 0;
        daysArr[daysArr.length] = "mList";
        _makeList("mNode", "mList", "early_t_m");
      }

      daysObj.mList += 1;
    } else {
      let d = new Date(nc),
        dY = d.getFullYear(),
        dM = d.getMonth(),
        mId = dM + "_" + dY,
        lm = mId + "_L";

      let msg = chrome.i18n.getMessage(mj_[dM]) + " " + dY;

      stash[i].par = lm;
      if (!daysObj[lm]) {
        daysObj[lm] = 0;
        daysArr[daysArr.length] = lm;
        _makeList(mId, lm, msg, 1);
      }

      daysObj[lm] += 1;
    }
  }

  let conHeight = 0;

  for (let m = 0, l = daysArr.length; m < l; m++) {
    let n1 = daysArr[m],
      gl = document.getElementById(n1);
    let ch = daysObj[n1];

    let calcH = Math.ceil(ch / e1) * 190; //visina liste

    gl.style.height = calcH + "px";

    gl.previousSibling.style.top = conHeight + "px";
    gl.style.top = conHeight + 36 + "px";
    gl.x = 0;
    gl.y = 0;

    let sum = calcH + 76; // visina liste + visina naziva + margina liste

    conHeight += sum; // dodaj za ukupnu visinu con
  }

  for (let j = stash.length - 1; j >= 0; j--) _addNode(stash[j]);

  con.style.height = conHeight + 50 + "px";
};

const _addNode = a => {
  let d1 = new URL(a.u).hostname;
  if (d1.startsWith("www.")) d1 = d1.substring(4);

  let p = document.getElementById(a.par);

  let blok = document.createElement("div");
  blok.className = "blokNode";
  blok.id = a.v;
  blok.u = a.u;
  blok.p = a.p;
  blok.t = a.t;
  blok.style.top = p.y;
  blok.style.left = p.x;
  p.appendChild(blok);

  let slika = document.createElement("img");
  slika.className = "slikaN";
  slika.setAttribute("data-src", a.i);
  slika.src = "../img/ph.png";
  blok.appendChild(slika);

  let n3_1 = document.createElement("img");
  n3_1.className = "imgPrv_ico";
  n3_1.setAttribute(
    "style",
    "position: absolute;display: none;width: 24px;height: 24px;left: 210px;top:122px;z-index: 100;"
  );
  blok.appendChild(n3_1);

  let naziv = document.createElement("div");
  naziv.className = "nazivN";
  naziv.textContent = a.t;
  blok.appendChild(naziv);

  blok.addEventListener("mouseup", _mu);
  blok.addEventListener("mousedown", function(e) {
    e.stopPropagation();
    e.preventDefault();

    if (ctxM_) ctxM_.blur();

    this.style.transform = "scale(0.97)";
    this.addEventListener("mouseleave", _ml);

    testId = this.id;
  });

  lio.observe(slika);

  p.x += 260;

  if (p.x >= e2) {
    p.x = 0;
    p.y += 190;
  }
};

function _ml(e) {
  // mouse leave
  this.style.transform = "scale(1)";
  this.removeEventListener("mouseleave", _ml);
}

function _mu(e) {
  // mouseUp na node
  this.style.transform = "scale(1)";
  this.removeEventListener("mouseleave", _ml);

  if (this.id === testId) {
    if (e.target.className === "slikaN" || e.target.className === "nazivN") {
      if (e.button === 0) {
        if (data.op8) {
          if (data.op2 && e.metaKey) _tabOpen(this.u, false);
          else if (data.op1) _tabOpen(this.u, true);
          else chrome.tabs.update({ url: this.u });
        } else {
          if (data.op2 && e.ctrlKey) _tabOpen(this.u, false);
          else if (data.op1) _tabOpen(this.u, true);
          else chrome.tabs.update({ url: this.u });
        }
      } else if (e.button === 1) _tabOpen(this.u, false);
      else if (e.button === 2) {
        ctxM_ = document.createElement("div");
        ctxM_.className = "ctxM";
        ctxM_.u = this.u;

        this.style.backgroundColor = "#1D6199";

        let c1 = document.createElement("div");
        c1.className = "ctxN";
        c1.id = "cn1";
        c1.textContent = chrome.i18n.getMessage("ont");
        ctxM_.appendChild(c1);

        let c2 = document.createElement("div");
        c2.className = "ctxN";
        c2.id = "cn2";
        c2.textContent = chrome.i18n.getMessage("del");
        ctxM_.appendChild(c2);

        let pw = con.clientWidth,
          x = e.pageX,
          y = e.pageY,
          wih = window.innerHeight;

        ctxM_.style.top = y + "px";
        ctxM_.style.left = x + "px";
        ctxM_.style.display = "block";

        document.documentElement.appendChild(ctxM_);

        ctxM_.addEventListener("click", _cp);
        ctxM_.addEventListener("blur", _cb);
        ctxM_.setAttribute("tabIndex", "1");
        ctxM_.focus();
      }
    }
  }
}

function _topCl(e) {
  //header click
  if (e.button === 0) {
    if (e.target.id === "srBtn") _makeSearch();
    else if (e.target.id === "settings") {
      if (!d_d.o) {
        d_d.style.opacity = "1";
        d_d.style.top = 62 + "px";
        d_d.o = 1;
        d_d.focus();
      }
    }
  }
}

const _tabOpen = (a, b) => {
  // main function for opening new tab
  if (data.op6) {
    chrome.tabs.query({ currentWindow: true, active: true }, t => {
      chrome.tabs.create({ url: a, active: b, index: t[0].index + 1 });
    });
  } else chrome.tabs.create({ url: a, active: b });
};

/*****************  CONTEXT MENU & DROP-DOWN MENU ********************/

function _makeSearch() {
  // search - start
  let a = document.createElement("div");
  a.className = "topB";
  t_.appendChild(a);

  let b = document.createElement("input");
  b.type = "search";
  b.placeholder = chrome.i18n.getMessage("sph");
  b.className = "hsb";
  a.appendChild(b);

  b.addEventListener("input", _search);
  b.addEventListener("keydown", _escSr);
  b.focus();

  a.addEventListener("click", function(e) {
    if (e.button === 0 && e.target === this) _searchOff(this, b);
  });

  con.innerHTML = "";
}

function _search() {
  // traverse - search
  var k = this.value.toLowerCase();

  con.innerHTML = "";

  if (this.value.length > 2) {
    let novi = [];
    for (let j = 0, d = s_.length; j < d; j++) {
      let test = s_[j].u + " " + s_[j].t;
      if (test.toLowerCase().includes(k)) novi[novi.length] = s_[j];
    }

    _go(novi);
  }
}

function _escSr(e) {
  //escape key listener in search field
  if (27 === e.keyCode) _searchOff(this.parentNode, this);
}

const _searchOff = (a, b) => {
  //click on search blue header - close search
  b.className += " topItem_off";
  setTimeout(() => {
    a.className += " topIBg_off";
  }, 200);
  setTimeout(() => {
    t_.removeChild(a);
  }, 400);

  con.style.opacity = 0;
  setTimeout(() => {
    con.innerHTML = "";
    _go(s_);
    con.style.opacity = 1;
  }, 300);
};

/*****************  CONTEXT MENU & DROP-DOWN MENU ********************/

function _cp(e) {
  // context menu click
  if (e.button === 0) {
    if (e.target.id === "cn1") {
      _tabOpen(this.u, false);
      this.blur();
    } else if (e.target.id === "cn2") {
      _removeNode(this.u);
      _spliceSend(this.u);
      this.blur();
    }
  }
}

function _dc(e) {
  // drop-down menu click
  if (e.button === 0) {
    if (e.target.id === "d_d_02") _delAll();
    else if (e.target.id === "d_d_03") _delVis();
    else if (e.target.id === "d_d_04") {
      con.style.opacity = 0;
      setTimeout(() => {
        con.innerHTML = "";
        _showUV();
      }, 400);
    } else if (e.target.id === "d_d_05") chrome.runtime.sendMessage({ exp: 1 });
    else if (e.target.id === "d_d_06") chrome.runtime.openOptionsPage();
    else if (e.target.id === "d_d_07")
      chrome.tabs.create({
        url:
          "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4LFHZT6R4K6CA",
        active: true
      });
  }

  d_d.blur();
}

function _cb() {
  // context menu blur
  let u = this.u,
    getN = document.getElementsByClassName("blokNode");

  this.parentNode.removeChild(this);

  ctxM_ = null;

  for (let i = getN.length - 1; i >= 0; i--) {
    if (getN[i].u === u) getN[i].style.backgroundColor = "";
  }
}

const _mB = () => {
  // drop-down menu blur
  d_d.style.opacity = 0;

  setTimeout(() => {
    d_d.style.top = -350 + "px";
    d_d.o = 0;
  }, 300);
};

/***************** 	REMOVE - DELETE FUNCTIONS ********************/

const _removeNode = a => {
  // remove single node from DOM
  let getR = document.getElementById("rf");
  if (getR) return;

  let gn = document.getElementsByClassName("blokNode"),
    p,
    ps,
    pcl;
  for (let i = gn.length - 1; i >= 0; i--) {
    if (gn[i].u === a) {
      let n = gn[i];
      p = n.parentNode;
      ps = p.previousSibling;
      let pocetak = p.clientHeight;

      n.style.width = 0;
      br.broj -= 1;
      br.textContent = br.broj;

      pcl = p.children.length;
      let max = Math.ceil(pcl / e1);
      let max2 = Math.ceil((pcl - 1) / e1);

      if (pcl < 2) {
        ps.style.height = 0;
        p.style.height = 0;

        setTimeout(() => {
          ps.parentNode.removeChild(ps);
          p.parentNode.removeChild(p);

          let gal = document.getElementsByClassName("LClass"),
            summ = 0;
          for (let k = 0, d = gal.length; k < d; k++) {
            if (gal[k] !== p) {
              gal[k].previousSibling.style.top = summ + "px";
              gal[k].style.top = summ + 36 + "px";
              summ += gal[k].clientHeight + 76;
            }
          }

          con.style.height = summ + 50 + "px";
        }, 300);
      } else if (max !== max2) {
        setTimeout(() => {
          p.removeChild(n);
        }, 300);

        let newH = max2 * 190;
        p.style.height = newH + "px";

        _pomakUnutarListe(p, a);

        if (p.nextSibling) {
          let gal = document.getElementsByClassName("LClass"),
            summ = 0;

          for (let k = 0, d = gal.length; k < d; k++) {
            if (gal[k] !== p) {
              gal[k].previousSibling.style.top = summ + "px";
              gal[k].style.top = summ + 36 + "px";
              summ += gal[k].clientHeight + 76;
            } else summ += newH + 76;
          }

          con.style.height = summ + 50 + "px";
        } else con.style.height = con.clientHeight - 190 + "px";
      } else {
        setTimeout(() => {
          p.removeChild(n);
        }, 300);
        _pomakUnutarListe(p, a);
      }

      break;
    }
  }
};

const _spliceSend = a => {
  // delete single node from stash array & notify other views
  let dNode;

  for (let i = s_.length - 1; i >= 0; i--) {
    if (s_[i].u === a) {
      dNode = s_.splice(i, 1);
    }
  }

  chrome.runtime.sendMessage({ delUrl: a, s: s_, d_n: dNode });
};

const _delAll = () => {
  //delete all pages
  let cf = confirm(chrome.i18n.getMessage("confirm1"));

  if (cf == true) {
    s_ = [];

    con.innerHTML = "";

    br.textContent = 0;
    br.broj = 0;

    chrome.runtime.sendMessage({ delAll: 1 });
  }
};

const _delVis = () => {
  //delete visited pages
  let cf = confirm(chrome.i18n.getMessage("confirm2"));
  if (cf == true) {
    let vis = [];
    for (let i = s_.length - 1; i >= 0; i--) {
      if (s_[i].p) {
        vis.unshift(s_[i]);
        s_.splice(i, 1);
        f = 1;
      }
    }

    if (vis.length) {
      con.style.opacity = 0;

      setTimeout(() => {
        con.innerHTML = "";
        _go(s_);
      }, 300);

      br.textContent = s_.length;
      br.broj = s_.length;

      setTimeout(() => {
        con.style.opacity = 1;
      }, 500);

      chrome.runtime.sendMessage({ delVis: s_, d_v: vis });
    }
  }
};

const _pomakUnutarListe = (a, b) => {
  let gn = a.getElementsByClassName("blokNode"),
    x = 0,
    y = 0;
  for (let k = 0, d = gn.length; k < d; k++) {
    if (gn[k].u !== b) {
      gn[k].style.top = y + "px";
      gn[k].style.left = x + "px";

      x += 260;

      if (x >= e2) {
        x = 0;
        y += 190;
      }
    }
  }
};

chrome.runtime.onMessage.addListener(m => {
  if (m.ukloni) {
    s_ = m.s;
    _removeNode(m.ukloni);
  } else if (m.dodaj) _ref();
  else if (m.vis) {
    _visitNode(m.vis);
    s_ = m.s;
  } else if (m.oImp || m.delVis) _ref();
  else if (m.imgDrop) {
    s_ = m.imgDrop;
    let gn = document.getElementsByClassName("blokNode"),
      u = m.url,
      im = m.img_;

    for (let i = gn.length - 1; i >= 0; i--) {
      if (gn[i].u === u) {
        let i1 = gn[i].getElementsByClassName("slikaN")[0];
        getI.onerror = function() {
          getI.src = "../img/def.png";
        };
        getI.src = im;
        i1.setAttribute("data-src", im);
      }
    }
  } else if (m.delUrl) {
    s_ = m.s;
    _removeNode(m.delUrl);
  } else if (m.delAll) {
    s_ = [];

    con.innerHTML = "";

    br.textContent = 0;
    br.broj = 0;
  } else if (m.d_new) data = m.d_new;
  else if (m.rf_) window.location.reload();
});

const _showUV = () => {
  //show unvisited pages
  let unv = [];

  for (let i = 0, l = s_.length; i < l; i++) {
    if (!s_[i].p) unv[unv.length] = s_[i];
  }

  let a = document.createElement("div");
  a.className = "topB";
  t_.appendChild(a);

  let b = document.createElement("div");
  b.className = "topBack";
  b.textContent = chrome.i18n.getMessage("back");
  a.appendChild(b);

  _go(unv);

  con.style.opacity = 1;

  a.addEventListener("click", e => {
    if (e.button === 0) {
      con.style.opacity = 0;
      con.innerHTML = "";
      b.className += " topItem_off";

      setTimeout(() => {
        a.className += " topIBg_off";
      }, 200);
      setTimeout(() => {
        t_.removeChild(a);
      }, 400);

      setTimeout(() => {
        _go(s_);
        con.style.opacity = 1;
      }, 400);
    }
  });
};

const _visitNode = a => {
  //update visit info - msg from background
  let getNodes = document.getElementsByClassName("blokNode");

  for (let i = getNodes.length - 1; i >= 0; i--) {
    if (getNodes[i].u === a) getNodes[i].p = 1;
  }
};

const _ref = () => {
  //refresh - dark overlay - click to continue
  let getR = document.getElementById("rf");
  if (getR) return;

  let rBg = document.createElement("div");
  rBg.setAttribute(
    "style",
    "position:fixed;width:100%;height:100%;top:0;left:0;-webkit-user-select:none;z-index:2147483647;overflow:hidden;background-color:rgba(0,0,0,0.8)"
  );
  document.body.appendChild(rBg);
  rBg.addEventListener("click", () => {
    window.location.reload();
  });

  let rBlok = document.createElement("div");
  rBlok.id = "rf";
  rBg.appendChild(rBlok);
  rBlok.textContent = chrome.i18n.getMessage("ctf");
};

/***************** 	LISTENER FUNCTIONS ********************/

function scr() {
  // background scroll function from listener
  if (ctxM_) ctxM_.blur();

  if (bg.scrollTop > 20) {
    top_bg.style.boxShadow = "0 7px 10px 5px rgba(0,0,0,0.5)";
    gore.style.display = "block";
  } else {
    top_bg.style.boxShadow = "";
    gore.style.display = "none";
  }
}

const _winRes = () => {
  // window resize function
  if (ctxM_) ctxM_.blur();
  if (d_d.o) d_d.blur();

  wiw = window.innerWidth - 200;
  e1 = Math.floor(wiw / 260);
  e2 = e1 * 260;
  e3 = Math.floor((wiw - e2) / 2);

  con.style.width = e2 + "px";
  con.style.left = e3 + 100 + "px";

  let gl = document.getElementsByClassName("LClass");
  let donjaGr = 0;

  for (let j = 0, l = gl.length; j < l; j++) {
    let list = gl[j];
    let ch = list.children;
    let d = ch.length;
    let max = Math.ceil(d / e1);

    let prevSib = list.previousSibling;
    prevSib.style.top = donjaGr + "px";

    list.style.top = donjaGr + 36 + "px";
    list.style.height = max * 190 + "px";

    let x = 0,
      y = 0;
    let tmpN = max * 190 + 76;
    donjaGr += tmpN;

    for (let i = 0; i < d; i++) {
      ch[i].style.top = y;
      ch[i].style.left = x;
      x += 260;

      if (x >= e2) {
        x = 0;
        y += 190;
      }
    }
  }

  con.style.height = donjaGr + 50 + "px";
};

function _gc() {
  // gore click
  if (bg.scrollY !== 0) bg.scrollTo(0, 0);
}

window.addEventListener("resize", () => {
  // window resize listener
  clearTimeout(winRes_);
  winRes_ = setTimeout(_winRes, 200);
});
