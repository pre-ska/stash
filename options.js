var data, lio;
let tr, tr_o, st_o;
let gn = null,
  lc_ = null;
let trFlag = 0;

function wr() {
  // window resize
  if (window.innerWidth > 1015) {
    var w1 = (window.innerWidth - 620) / 2;
    menu.style.left = w1 - 200 + "px";
    menu.style.display = "block";
    menu.style.transform = "scale(1)";
    pan.style.left = w1 + "px";
    pan.style.display = "block";
    trop.style.left = w1 + 64 + "px";
    //LM.style.left = 0 + 'px';
  } else {
    menu.style.left = 0 + "px";
    menu.style.display = "block";
    menu.style.transform = "scale(0.7)";
    pan.style.left = 200 + "px";
    pan.style.display = "block";
    trop.style.left = 200 + "px";
    //LM.style.left = -120 + 'px';
  }

  /* 	if (window.innerWidth > 1180) LM.style.left = 0 + 'px';
	else LM.style.left = -120 + 'px';
 */

  var wt = window.innerWidth - 310;

  if (wt > 0) {
    wt /= 2;
    box_t.style.left = wt + "px";
    box_t.style.display = "block";
  } else {
    box_t.style.left = 0 + "px";
    box_t.style.display = "block";
  }
}

function mCl(e) {
  // menu click
  if (e.button === 0) {
    let etgid = e.target.id;

    if (etgid === "m5")
      chrome.tabs.create({
        url:
          "https://addons.opera.com/search/?type=extensions&developer=vux777",
        active: !0
      });
    else {
      con.scrollTop = 0;

      let etg = e.target;
      let getChM = menu.children,
        i = getChM.length,
        getChP = pan.children,
        j = getChP.length;

      while (i--) {
        getChM[i].className = "mBtn";
        getChM[i].getElementsByClassName("m_img")[0].style.filter =
          "invert(0) brightness(1)";
      }

      while (j--) getChP[j].style.display = "none";

      etg.className = "mBtn mBtnA";
      if (etgid !== "m6")
        etg.getElementsByClassName("m_img")[0].style.filter =
          "invert(1) brightness(2)";

      document.getElementById(e.target.dataset.r).style.display = "block";

      if (etgid === "m7") _getTr();
      else {
        if (trFlag) {
          trFlag = 0;
          trop.className += " topItem_off";

          setTimeout(() => {
            trop.className = "tropC";
            trop.style.display = "none";
          }, 500);
        }

        if (etgid === "m8") _st();
      }
    }
  }
}

const _getTr = () => {
  // dohvati trash
  trop2.className = "trBtn_off";
  trop1.className = "trBtn_off";
  trFlag = 1;
  tr_o.innerHTML = "";

  chrome.storage.local.get("trash", r => {
    tr = r.trash;
    if (tr.length) {
      trop1.className = "trBtn";
      let ta = [],
        to = {};

      for (let i = tr.length - 1; i >= 0; i--) {
        let z = tr[i].u;
        if (!to[z]) {
          to[z] = 1;
          ta[ta.length] = tr[i];
        }
      }
      ta.reverse();

      for (let j = ta.length - 1; j >= 0; j--) _aN(ta[j]);
    } else _trEmpty();

    trop.style.display = "flex";
  });
};

const _st = () => {
  // statistika
  chrome.storage.local.get(["s_", "data"], r => {
    let s_ = r.s_ || [];
    table.innerHTML = "";

    let d = new Date(),
      today = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(),
      /* 		_7d = today - 604800000,
		_15d = today - 1296000000,
		_30d = today - 2592000000,
		_60d = today - 5184000000,
		_90d = today - 7776000000; */
      _7d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7).getTime(),
      _15d = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() - 15
      ).getTime(),
      _30d = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() - 30
      ).getTime(),
      _60d = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() - 60
      ).getTime(),
      _90d = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate() - 90
      ).getTime();

    let arr = ["", "set_w3", "set_w4", "set_w5", "set_w6", "set_w7"];
    let arr_ = [0, 0, 0, 0, 0, 0];
    let arr__ = [0, _7d, _15d, _30d, _60d, _90d];

    for (let i = s_.length - 1; i >= 0; i--) {
      if (s_[i].v < _7d) arr_[1] += 1;
      if (s_[i].v < _15d) arr_[2] += 1;
      if (s_[i].v < _30d) arr_[3] += 1;
      if (s_[i].v < _60d) arr_[4] += 1;
      if (s_[i].v < _90d) arr_[5] += 1;
    }

    bn.innerHTML =
      "<b>" +
      s_.length +
      "</b>&nbsp;&nbsp;  " +
      chrome.i18n.getMessage("set_w1");

    for (let k = 0; k < 6; k++) {
      let g = arr[k];

      let tb = document.createElement("div");
      tb.className = "tbWide";
      table.appendChild(tb);

      let tb_1 = document.createElement("div");
      tb_1.className = "tbCell";
      tb.appendChild(tb_1);

      let tb_2 = document.createElement("div");
      tb_2.className = "tbCell";
      tb.appendChild(tb_2);

      if (k === 0) {
        tb.className = "tbWide_0";
        tb_1.textContent = chrome.i18n.getMessage("set_w2");
        tb_2.textContent = chrome.i18n.getMessage("set_w8");
      } else {
        tb.x = k;
        tb_1.textContent = chrome.i18n.getMessage(arr[k]);
        tb_2.textContent = arr_[k];
      }

      if (arr_[k]) {
        let tb_3 = document.createElement("div");
        tb_3.className = "tbBtn";
        tb_3.title =
          chrome.i18n.getMessage("set_trStats") +
          "\n" +
          chrome.i18n.getMessage(arr[k]);
        tb.appendChild(tb_3);
        tb_3.addEventListener("click", function(e) {
          if (e.button === 0) {
            let as = arr__[this.parentNode.x];
            //_tbCl(as).then(() => { _mdSim(m8); });
            _tbCl(as);
          }
        });
      }
    }
  });
};

/* 
const _tbCl = a => { // delete older than.... trash klik
	return new Promise( function(rs, rj) {
		chrome.storage.local.get('s_', r => {
			let s_ = r.s_ || [];
			
			for (let i = s_.length - 1; i >= 0; i--) {
				if (s_[i].v < a) {
					let orig = s_.splice(i + 1);

					chrome.storage.local.set({ 's_': orig }, () => {
						chrome.runtime.sendMessage({ delVis: orig, d_v: s_}, () => {
							rs();
						});
					});
					
					break;
				}
			}
		});
	});
} 
*/

const _tbCl = a => {
  // delete older than.... trash klik
  chrome.storage.local.get("s_", r => {
    let s_ = r.s_ || [];

    for (let i = s_.length - 1; i >= 0; i--) {
      if (s_[i].v < a) {
        let orig = s_.splice(i + 1);

        chrome.runtime.sendMessage({ delVis: orig, d_v: s_ });

        break;
      }
    }
  });
};

const _aN = a => {
  // kreiraj node za trash
  let blok = document.createElement("div");
  blok.className = "b1";
  blok.a = 0;
  blok.u = a.u;
  blok.t = a.t;
  tr_o.appendChild(blok);

  let slika = document.createElement("img");
  slika.className = "b2";
  slika.setAttribute("data-src", a.i);
  slika.src = "img/ph.png";
  blok.appendChild(slika);

  let n3_1 = document.createElement("img");
  n3_1.className = "imgPrv_ico";
  n3_1.setAttribute(
    "style",
    "position: absolute;display: none;width: 24px;height: 24px;left: 83px;top:53px;z-index: 100;"
  );
  blok.appendChild(n3_1);

  let naziv = document.createElement("div");
  naziv.className = "b3";
  naziv.textContent = a.t;
  blok.appendChild(naziv);

  blok.addEventListener("mousedown", e => {
    e.stopPropagation();
    e.preventDefault();
  });

  lio.observe(slika);
};

const _bCl = e => {
  // klik na blok u trashu
  if (e.button === 0) {
    let et = e.target;

    if (et.className === "b1") {
      (gn = document.getElementsByClassName("b1")), (xa = et.a);

      if (e.ctrlKey) {
        if (xa) {
          et.style.backgroundColor = "";
          et.a = 0;
        } else {
          et.style.backgroundColor = "#7CACD6";
          et.a = 1;
        }
      } else if (e.shiftKey) {
        if (lc_ && et !== lc_) {
          let r1 = et.getBoundingClientRect().top,
            r2 = lc_.getBoundingClientRect().top;
          let min = r1,
            max = r2;

          if (r1 > r2) {
            min = r2;
            max = r1;
          }

          for (let i = gn.length - 1; i >= 0; i--) {
            let w = gn[i].getBoundingClientRect().top;
            if (w >= min && w <= max) {
              gn[i].style.backgroundColor = "#7CACD6";
              gn[i].a = 1;
            } else {
              gn[i].style.backgroundColor = "";
              gn[i].a = 0;
            }
          }
        }
      } else {
        let b = 0;

        for (let i = gn.length - 1; i >= 0; i--) {
          if (gn[i].a && gn[i] !== et) b = 1;
          gn[i].style.backgroundColor = "";
          gn[i].a = 0;
        }

        if (!xa) {
          et.style.backgroundColor = "#7CACD6";
          et.a = 1;
        } else {
          if (b) {
            et.style.backgroundColor = "#7CACD6";
            et.a = 1;
          } else {
            if (et === lc_) {
              et.style.backgroundColor = "#7CACD6";
              et.a = 1;
            }
          }
        }
      }

      lc_ = et;
      _checkSel();
    }

    gn = null;
  }
};

const _checkSel = () => {
  // provjeri dali ima selekiranih i promjeni button za restore
  let f = 1;
  for (let i = gn.length - 1; i >= 0; i--) {
    if (gn[i].a) {
      f = 0;
      break;
    }
  }

  f ? (trop2.className = "trBtn_off") : (trop2.className = "trBtn");
};

const LMCl = e => {
  // click na browser buttons (chrome, ff, opera)
  if (e.target.id === "o_btn")
    chrome.tabs.create({
      url: "https://addons.opera.com/extensions/details/v7-stash/",
      active: true
    });
};

const _cs = () => {
  // scroll listener za top podlogu
  if (con.scrollTop > 0) {
    podloga.style.boxShadow = "0 0 10px 3px rgba(0,0,0,0.4)";
    podloga.style.borderBottom = "4px solid #8494A5";
  } else {
    podloga.style.boxShadow = "";
    podloga.style.borderBottom = "";
  }
};

const _tropCL = e => {
  // trash option click - plavi header
  if (e.button === 0) {
    let et = e.target;

    if (et.id === "trop1" && et.className === "trBtn") {
      trop1.className = "trBtn_off";
      trop2.className = "trBtn_off";
      tr = [];
      chrome.storage.local.set({ trash: [] });
      tr_o.innerHTML = "";
      _trEmpty();
    } else if (et.id === "trop2" && et.className === "trBtn") {
      trop2.className = "trBtn_off";

      let tmpObj = {},
        tmpArr = [];

      gn = document.getElementsByClassName("b1");

      for (let j = gn.length - 1; j >= 0; j--) {
        if (gn[j].a) {
          tmpObj[gn[j].u] = 1;
          tr_o.removeChild(gn[j]);
        }
      }

      for (let i = tr.length - 1; i >= 0; i--) {
        if (tmpObj[tr[i].u]) {
          tmpArr[tmpArr.length] = tr[i];
          tr.splice(i, 1);
        }
      }

      chrome.storage.local.get("s_", r => {
        let s_ = r.s_,
          newA = [],
          ta = [],
          to = {};
        newA = s_.concat(tmpArr);

        for (let k = 0, l = newA.length; k < l; k++) {
          let z = newA[k].u;
          if (!to[z]) {
            to[z] = 1;
            ta[ta.length] = newA[k];
          }
        }

        ta.sort(function(a, b) {
          return a.v - b.v;
        });

        chrome.runtime.sendMessage({ oImp: ta });

        chrome.storage.local.set({ trash: tr });
      });

      if (!tr.length) {
        trop1.className = "trBtn_off";
        _trEmpty();
      }
    }
  }
};

const fic = () => {
  // fake import click
  let imp = document.createElement("input");
  imp.type = "file";
  imp.accept = ".json";
  imp.id = "impId";
  document.body.appendChild(imp);

  imp.addEventListener("change", _impC);

  imp.click();
};

function _impC() {
  // input click
  var dataF = this.files,
    rN = new FileReader();
  rN.onload = _sST;
  rN.readAsText(dataF[0]);
}

function _sST() {
  // save import to stash
  let x = JSON.parse(this.result);

  if (x.expDataType && x.version && x.data) {
    if (x.expDataType === "V7_Stash") {
      chrome.storage.local.get("s_", r => {
        let s_ = r.s_,
          newA = [],
          ta = [],
          to = {};
        newA = s_.concat(x.data);

        newA.sort(function(a, b) {
          return a.v - b.v;
        });

        for (let i = newA.length - 1; i >= 0; i--) {
          let z = newA[i].u;
          if (!to[z]) {
            to[z] = 1;
            ta.unshift(newA[i]);
          }
        }

        chrome.runtime.sendMessage({ oImp: ta });
      });
    } else {
      alert(chrome.i18n.getMessage("set_alert1"));
      x = null;
    }
  } else if (Array.isArray(x)) {
    let a = x[0];
    if (a.expDataType && a.expDataType === "V7 Stash2") {
      let xa = [];

      for (let j = x.length - 1; j >= 2; j--) {
        /* 				let g1 = x[j].date.split('/');
				let g2 = g1[2].trim() + '-' + g1[1].trim() + '-' + g1[0].trim();
				let az = new Date(g2).getTime(); */
        let az = new Date(
          x[j].date
            .split("/")
            .reverse()
            .map(e => e.trim())
            .join("-")
        ).getTime();

        let ts = { t: x[j].nam, u: x[j].url, i: "../img/def.png", v: az, p: 0 };
        xa[xa.length] = ts;
      }

      chrome.storage.local.get("s_", r => {
        let s_ = r.s_,
          newA = [],
          ta = [],
          to = {};
        newA = s_.concat(xa);

        for (let i = newA.length - 1; i >= 0; i--) {
          let z = newA[i].u;
          if (!to[z]) {
            to[z] = 1;
            ta[ta.length] = newA[i];
          }
        }

        ta.sort(function(a, b) {
          return a.v - b.v;
        });

        chrome.runtime.sendMessage({ oImp: ta });
        //newA = ta = to = null;
        alert(
          chrome.i18n.getMessage("set_alert2") +
            " \n" +
            chrome.i18n.getMessage("set_alert3")
        );
      });
    }

    x = null;
  } else {
    alert(chrome.i18n.getMessage("set_alert1"));
    x = null;
  }

  let getimp = document.getElementById("impId");
  getimp.parentNode.removeChild(getimp);
}

function _op(e) {
  // options klik
  if (e.button === 0) {
    let tgC = e.target.className,
      tgI = e.target.id,
      f = 0;

    if (e.target.className === "boxA boxE") {
      e.target.className = "boxA boxC";
      f = 1;
      if (e.target.id === "op1") data.op1 = 1;
      else if (e.target.id === "op2") data.op2 = 1;
      else if (e.target.id === "op3") {
        data.op3 = 1;
        chrome.runtime.sendMessage({ d_ctx: 1, d_true: 1 });
      } else if (e.target.id === "op4") {
        data.op4 = 1;
        chrome.runtime.sendMessage({ theme: 2 });
      } else if (e.target.id === "op6") data.op6 = 1;
      else if (e.target.id === "op7") data.op7 = 1;
    } else if (e.target.className === "boxA boxC") {
      e.target.className = "boxA boxE";
      f = 1;
      if (e.target.id === "op1") data.op1 = 0;
      else if (e.target.id === "op2") data.op2 = 0;
      else if (e.target.id === "op3") {
        data.op3 = 0;
        chrome.runtime.sendMessage({ d_ctx: 1, d_true: 0 });
      } else if (e.target.id === "op4") {
        data.op4 = 0;
        chrome.runtime.sendMessage({ theme: 1 });
      } else if (e.target.id === "op6") data.op6 = 0;
      else if (e.target.id === "op7") data.op7 = 0;
    }

    f && chrome.runtime.sendMessage({ d_new: data });
  }
}

chrome.runtime.onMessage.addListener(m => {
  if (m.trashR) {
    // message from bg refresh trash
    if (tr_o.style.display === "block") _mdSim(m7);
    else if (st_o.style.display === "block") _mdSim(m8);
  } else if (m.rf_) window.location.reload();
});

document.addEventListener("DOMContentLoaded", () => {
  var ww = window.innerWidth,
    wt = ww - 310;

  if (ww > 1015) {
    var w1 = (ww - 620) / 2;
    menu.style.left = w1 - 200 + "px";
    menu.style.display = "block";
    pan.style.left = w1 + "px";
    pan.style.display = "block";
    trop.style.left = w1 + 64 + "px";
  } else {
    menu.style.left = 0 + "px";
    menu.style.display = "block";
    pan.style.left = 200 + "px";
    pan.style.display = "block";
    trop.style.left = 200 + "px";
  }

  //if (window.innerWidth > 1180) setTimeout(() => { LM.style.left = 0 + 'px'; }, 1000)

  if (wt > 0) {
    wt /= 2;
    box_t.style.left = wt + "px";
    box_t.style.display = "block";
  } else {
    box_t.style.left = 0 + "px";
    box_t.style.display = "block";
  }

  //LM.addEventListener('click', LMCl);
  menu.addEventListener("mousedown", mCl);

  chrome.storage.local.get("data", r => {
    data = r.data;
    if (data.op1) op1.className = "boxA boxC";
    if (data.op2) op2.className = "boxA boxC";
    if (data.op3) op3.className = "boxA boxC";
    if (data.op4) op4.className = "boxA boxC";
    //if (data.op5) op5.className = 'boxA boxC';
    if (data.op6) op6.className = "boxA boxC";
    if (data.op7) op7.className = "boxA boxC";
  });

  document.documentElement.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });
  con.addEventListener("scroll", _cs);
  window.addEventListener("resize", wr);
  fakeImp.addEventListener("click", fic);
  opPH.addEventListener("click", _op);

  exp.addEventListener("click", function() {
    chrome.runtime.sendMessage({
      exp: "stash"
    });
  });

  let mbl2 = document.querySelectorAll("[data-i18n]");
  for (let p2 = mbl2.length - 1; p2 >= 0; p2--)
    mbl2[p2].textContent = chrome.i18n.getMessage(
      mbl2[p2].getAttribute("data-i18n")
    );

  let mbl = document.getElementsByClassName("versionDate");
  for (let p3 = mbl.length - 1; p3 >= 0; p3--) {
    let getD = Number(mbl[p3].textContent);
    let ld = new Date(getD);

    mbl[p3].textContent = ld.toLocaleDateString();
  }

  tr_o = document.getElementById("trash");
  st_o = document.getElementById("stats");
  tr_o.addEventListener("click", _bCl);
  trop.addEventListener("click", _tropCL);
  pp_link.addEventListener("click", () => {
    chrome.tabs.create({
      url:
        "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4LFHZT6R4K6CA",
      active: !0
    });
  });

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
      root: con,
      rootMargin: "300px"
    }
  );

  let upd = location.href.split("#");
  if (upd[1]) _mdSim(m2);
  else _mdSim(m1);

  /* 	c_btn.title = chrome.i18n.getMessage('lm_c');
	f_btn.title = chrome.i18n.getMessage('lm_f');
	o_btn.title = chrome.i18n.getMessage('lm_o'); */
});

const _mdSim = a => {
  // simulate mousedown
  let me = document.createEvent("MouseEvents");
  me.initEvent("mousedown", true, true);
  a.dispatchEvent(me);
};

const _trEmpty = () => {
  // run when trash is empty
  let fb = document.createElement("div");
  fb.id = "tr_fb";
  fb.innerHTML =
    chrome.i18n.getMessage("tr_emty_1") +
    "<br />" +
    chrome.i18n.getMessage("tr_emty_2");
  //fb.innerHTML = 'Here you can find' + '<br />' +' your deleted pages'+ '<br />' +  'during current browser session';
  tr_o.appendChild(fb);
};

/* const save_old = () {
	let o = { expDataType: 'V7_Stash', version: '1.0', data: s_ };
	let str = JSON.stringify(o, null, 4);

    let b = URL.createObjectURL(new Blob([str], { type: 'text/plain' }));
    chrome.downloads.download({ url: b, filename: 'V7_Stash.json' });	
} */
