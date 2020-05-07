let s_ = null,
  data = null,
  cl_ = 0,
  safe_ = {};
let pt = chrome.i18n.getMessage("v7add"); // page action title

/*
t - title
p - posjeta
v - vrijeme
u - url
i - image url
*/

/*
op1 - left click always in new tab
op2 - ctrl/cmd + left click in new tab
op3 - ctx menu
op4 - dark theme
op5 - close on blur (chrome)
op6 - new tab next to current
op7 - drag-out in active tab
op8 - mac system
op9 - list view
*/

chrome.runtime.onInstalled.addListener(d => {
  s_ = [];
  data = {
    op1: 0,
    op2: 0,
    op3: 0,
    op4: 0,
    op5: 0,
    op6: 0,
    op7: 0,
    op8: 0,
    op9: 0
  };
  /* 
	op1 - always in new tab with left click
	op2 - open in new tab with CTRL + left click
	op3 - ctx menu
	op4 - dark theme
	op5 - Auto-close sidebar on blur (chrome, edge)
	op6 - new tab next to current
	op7 - drag-out in active tab
	op8 - is mac
	op9 - list
	*/

  if (d.reason === "install") {
    chrome.storage.local.set({ s_: s_ }, () => {
      chrome.runtime.getPlatformInfo(a => {
        if (a.os === "mac") data.op8 = 1;
        chrome.storage.local.set({ data: data }, () => {
          chrome.runtime.openOptionsPage();
        });
      });
    });

    chrome.storage.local.set({ trash: [] });
  }
  if (d.reason === "update") {
    chrome.storage.local.get(["stash", "s_", "slike", "data"], r => {
      let st = r.stash,
        ts_s_ = r.s_,
        st_old = r.slike,
        dt = r.data;
      if (ts_s_ == undefined) {
        if (st) {
          let c = st.slice(0);
          let xa = [],
            to = {},
            ta = [];
          export_old(c);

          for (let j = st.length - 1; j >= 0; j--) {
            let az = new Date(
              st[j].date
                .split("/")
                .reverse()
                .map(e => e.trim())
                .join("-")
            ).getTime();

            let ts = {
              t: st[j].nam,
              u: st[j].url,
              i: "../img/def.png",
              v: az,
              p: 0
            };
            xa[xa.length] = ts;
          }

          for (let i = xa.length - 1; i >= 0; i--) {
            let z = xa[i].u;
            if (!to[z]) {
              to[z] = 1;
              ta[ta.length] = xa[i];
            }
          }

          ta.sort(function(a, b) {
            return a.v - b.v;
          });

          chrome.storage.local.set({ s_: ta }, () => {
            chrome.runtime.getPlatformInfo(a => {
              if (a.os === "mac") data.op8 = 1;
              chrome.storage.local.set({ data: data }, () => {
                chrome.tabs.create({ url: "options.html#1" });
              });
            });
          });

          chrome.storage.local.set({ trash: [] });

          chrome.storage.local.remove("slike", () => {
            let error = chrome.runtime.lastError;
            if (error) {
              console.error(error);
            }
          });
        } else console.log("error on update - can't find old stash");
      } else {
        if ("op9" in dt) return;

        dt.op9 = 0;
        data = dt;

        chrome.storage.local.set({ data: data }, () => {
          chrome.runtime.sendMessage({ rf_: 1 });
          chrome.tabs.create({ url: "options.html#1" });
        });
      }
    });
  }
});

const _rT = () => {
  // run trough tabs on start and import and place icons in address bar
  chrome.tabs.query({}, t => {
    for (let i = t.length - 1; i >= 0; i--) {
      if (!t[i].url.startsWith("chrome://")) _aI(t[i].url, t[i].id);
    }
  });
};

const _aI = (u, id) => {
  // test tab url vs stash and add icon...green or gray
  let test = 0,
    p = 0;

  if (!u.startsWith("chrome://")) {
    for (let i = s_.length - 1; i >= 0; i--) {
      if (s_[i].u === u) {
        test = 1;

        if (!s_[i].p) {
          s_[i].p = 1; // prva posjeta
          p = s_[i].u; // za poslat ostalim pogledima da updejtaju
        }

        break;
      }
    }

    test ? _zel(id) : _siv(id);

    if (p) {
      _save();
      chrome.runtime.sendMessage({ vis: p, s: s_ });
    }
  }
};

const _fT = (a, b) => {
  // find tab by URL and set icon
  if (!a.startsWith("chrome://")) {
    chrome.tabs.query({}, t => {
      for (let j = t.length - 1; j >= 0; j--) {
        if (a === t[j].url) {
          b ? _siv(t[j].id) : _zel(t[j].id);
        }
      }
    });
  }
};

const _zel = a => {
  // set green icon in address bar

  chrome.pageAction.setIcon({
    tabId: a,
    path: "img/stX24.png"
  });
  chrome.pageAction.setTitle({
    tabId: a,
    title: chrome.i18n.getMessage("v7remove")
  });
  chrome.pageAction.show(a);
};

// const _zel = a => {
//   // set green icon in address bar
//   console.log("zelena ikona");
//   chrome.pageAction.setIcon({ tabId: a, path: "img/stX.svg" });
//   chrome.pageAction.setTitle({
//     tabId: a,
//     title: chrome.i18n.getMessage("v7remove")
//   });
//   chrome.pageAction.show(a);
// };

const _siv = a => {
  // set gray icon in address bar

  chrome.pageAction.setIcon({ tabId: a, path: "img/st24.png" });
  chrome.pageAction.setTitle({
    tabId: a,
    title: chrome.i18n.getMessage("v7add")
  });
  chrome.pageAction.show(a);
};

const _tu = (a, b, t) => {
  // tab-on-update listener function
  //if (b.url) _aI(t.url, a);

  if (b.status === "loading") {
    if (b.url) {
      _aI(t.url, a);
      delete safe_[a];
    } else safe_[a] = 1;
  } else if (b.status === "complete") {
    if (safe_[a]) {
      delete safe_[a];

      _aI(t.url, a);
    }
  }
};

const _pc = a => {
  // pageAction click listener function
  let d_ = Date.now();

  if (d_ - cl_ > 600) {
    cl_ = d_;
    _pa_ctx(a.url, a.id, a.title, a.favIconUrl);
  }
};

const _pa_ctx = (a, b, c, d) => {
  // main function for pageAction click and contextMenu click
  chrome.pageAction.getTitle({ tabId: b }, r => {
    if (r) {
      if (r === pt) {
        // dodaj u listu
        _fT(a);

        if (a.startsWith("https://www.youtube.com")) {
          let rx = /(?:[?&]vi?=|\/embed\/|\/\d\d?\/|\/vi?\/|https?:\/\/(?:www\.)?youtu\.be\/)([^&\n?#]+)/,
            li = a.match(rx);

          if (li && li[1]) {
            let url = "http://img.youtube.com/vi/" + li[1] + "/0.jpg";
            _aN(
              c,
              a,
              url,
              "https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png"
            );
          } else _inj(c, a, b, d);
        } else _inj(c, a, b, d);
      } else {
        // ukloni iz liste
        _fT(a, 1);

        for (let i = s_.length - 1; i >= 0; i--) {
          if (s_[i].u === a) s_.splice(i, 1);
        }

        chrome.runtime.sendMessage({ ukloni: a, s: s_ });

        _save();
      }
    }
  });
};

const _inj = (a, b, c, d) => {
  // inject script
  let st = 'meta[property="og:image"]';
  chrome.tabs.executeScript(
    c,
    {
      code:
        "metaA =  document.querySelectorAll('" +
        st +
        "'); ctn = 0;\
		if (metaA[0] && metaA[0].content !=='') chrome.runtime.sendMessage( {img: metaA[0].content});\
		else {\
			let sk=null,sl=document.images;\
			for (let i=0,l=sl.length;i<l;i++) {\
				if(ctn>30)break;\
				if(sl[i].width>150 && sl[i].height>150) {\
					ctn++;\
					sk=sl[i];\
					if(sl[i].width>500 && sl[i].height>200) break;\
				}\
			}\
			if(sk) chrome.runtime.sendMessage({img: sk.src});\
			else chrome.runtime.sendMessage({img: '../img/def.png', img_e: 1});\
		}\
		metaA = null;ctn = null;"
    },
    r => {
      if (!r) {
        console.log(chrome.runtime.lastError);
        let _u = "../img/def.png";
        d && (_u = d);

        _aN(a, b, d, d);
      }
    }
  );
};

const _aC = () => {
  // add context menu item
  chrome.contextMenus.create({
    /* 		command: '_execute_page_action', */
    onclick: _cC,
    id: "v7_stash",
    title: chrome.i18n.getMessage("ctx"),
    contexts: ["all"]
  });
};

function _cC(e, t) {
  // context menu on-click listener function
  e.pageUrl && _pa_ctx(e.pageUrl, t.id, t.title, t.favIconUrl);
}

const _aN = (a, b, c, d) => {
  // add new node to stash, save stash and send msg to views
  let d_ = Date.now();

  let ts = { t: a, u: b, i: c, v: d_, p: 0, fu: d };

  s_[s_.length] = ts;

  _save();

  chrome.runtime.sendMessage({ dodaj: ts, s: s_ });
};

const _aU = a => {
  // add deleted pages to trash
  chrome.storage.local.get("trash", r => {
    let t = r.trash;
    t = t.concat(a);

    chrome.storage.local.set({ trash: t });
    chrome.runtime.sendMessage({ trashR: 1 });
  });
};

const _e = () => {
  // export
  /* ubaci ikone u export obj zbog FF */

  let i = s_.length,
    a = [],
    cnt;
  while (i--) a[a.length] = s_[i].u;

  (i = a.length), (cnt = a.length);

  let c_ = document.createElement("canvas");
  (c_.width = 16), (c_.height = 16);

  let ctx = c_.getContext("2d");
  let fo = {};
  let noF =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABfElEQVQ4T2NkoBAwUqifAcUAdnb2LqCBakDMBDWY+efPn95sbGyhv379Wo3NMhQD+Pj4FgANeQFU+A+kGKhJ+OPHj+k8PDyr/v79u/r79+8YhqAYICIiMpuDg+MNzKYfP36IvHnzJhUoPgdoANfv3783fPnyZRWyS1AMkJKSmsPJyfkWpgBoo/CzZ89SJCQkFjAxMf0Fekfgz58/K4GughuCYoC8vPw8bm7ud0gGCNy/fz/l////DUi27mFkZDwC46MYoKqqugDZAKBt7G/fvlUEGgALVAYgm/nly5euWA3Q1tZeBAxIuAuwhfqnT5+Erl69GofVAH19/SUCAgJ4Dfjw4YPQxYsXY7AaYGpqulRISOg9vsT17t07wdOnT0djNcDKymo5MQYcO3YsEqsBdnZ2qwQFBT8wMzODExI6AKYFpvfv3wscOnQoDKsBiYmJix8+fMgBlPyPwxuMioqKP+bOnRuL1QBgFCUCJeQJZLAHwHSwAKsBBDRilQYAInaYESmjmvoAAAAASUVORK5CYII=";

  while (i--) {
    (b => {
      if (!fo[b]) {
        let img = new Image();

        img.onload = () => {
          ctx.clearRect(0, 0, 16, 16);
          ctx.drawImage(img, 0, 0, 16, 16);

          let dt = c_.toDataURL("image/png");

          cnt--;

          if (dt !== noF) fo[b] = dt;

          if (!cnt) {
            let o = {
              expDataType: "V7_Stash",
              version: "1.0",
              data: s_,
              fav: fo
            };
            let str = JSON.stringify(o, null, 4);

            let blb = URL.createObjectURL(
              new Blob([str], { type: "application/json" })
            );
            chrome.downloads.download({ url: blb, filename: "V7_Stash.json" });
          }
        };

        img.src = "chrome://favicon/" + b;
      }
    })(a[i]);
  }
};

const expF = a => {
  let o = { expDataType: "V7_Stash", version: "1.0", data: s_, fav: a };
  let str = JSON.stringify(o, null, 4);

  let b = URL.createObjectURL(new Blob([str], { type: "application/json" }));
  chrome.downloads.download({ url: b, filename: "V7_Stash.json" });
};

chrome.runtime.onMessage.addListener((m, s) => {
  if (m.img) {
    // message from injected script
    if (m.img_e) {
      if (s.tab.favIconUrl)
        _aN(s.tab.title, s.tab.url, s.tab.favIconUrl, s.tab.favIconUrl);
      else _aN(s.tab.title, s.tab.url, m.img, s.tab.favIconUrl);
    } else _aN(s.tab.title, s.tab.url, m.img, s.tab.favIconUrl);
  } else if (m.exp) _e();
  // message from views - export
  else if (m.oImp) {
    // message from options - imported data
    s_ = m.oImp;

    _rT(); // run trough tabs and update icons according to new imported stash ( or restore from trash)

    _save(); // save stash to storage
  } else if (m.delUrl) {
    // message from sidebar/tab - delete single
    s_ = m.s;
    _fT(m.delUrl, 1);

    _save();
    _aU(m.d_n);
  } else if (m.delAll) {
    // message from sidebar - delete ALL
    let c = s_.slice(0);

    s_ = [];

    chrome.tabs.query({}, t => {
      for (let i = t.length - 1; i >= 0; i--) {
        if (!t[i].url.startsWith("chrome://")) _siv(t[i].id);
      }
    });

    _save();

    _aU(c);
  } else if (m.delVis) {
    // message from sidebar - delete VISITED
    s_ = m.delVis;

    chrome.tabs.query({}, t => {
      for (let i = t.length - 1; i >= 0; i--) {
        let z = 1,
          tu = t[i].url;

        if (!tu.startsWith("chrome://")) {
          for (let j = s_.length - 1; j >= 0; j--) {
            if (s_[j].u === t[i].url) {
              _zel(t[i].id);
              z = 0;
            }
          }

          z && _siv(t[i].id);
        }
      }
    });

    _save();

    _aU(m.d_v);
  } else if (m.imgDrop) {
    // message from sidebar - new image dropped
    s_ = m.imgDrop;
    _save();
  } else if (m.d_new) {
    data = m.d_new;
    chrome.storage.local.set({ data: data });
  } else if (m.d_ctx) {
    // message from options - add/remove ctx item
    if (m.d_true) _aC();
    else chrome.contextMenus.removeAll();
  }
});

setTimeout(() => {
  //wait 1 sec and then load data from storage
  chrome.storage.local.get(["s_", "data"], r => {
    (s_ = r.s_ || []), (data = r.data || []);
    _rT();

    if (data.op3) _aC();

    chrome.tabs.onUpdated.addListener(_tu);
    chrome.pageAction.onClicked.addListener(_pc);
    chrome.storage.local.set({ trash: [] });
  });
}, 1000);

chrome.commands.onCommand.addListener(c => {
  if (c === "openTab")
    chrome.tabs.create({ url: "tabGrid.html", active: true });
});

const _save = () => {
  chrome.storage.local.set({ s_: s_ });
};

function export_old(a) {
  if (a) {
    var stash = a,
      fObj = { expDataType: "V7 Stash2" };

    stash.unshift([]);
    stash.unshift(fObj);
    var strSt = JSON.stringify(stash);
    dlFn("V7_stash_old.json", strSt);
  } else {
    chrome.storage.local.get("stash", r => {
      let st = r.stash;
      if (st) {
        var stash = a,
          fObj = { expDataType: "V7 Stash2" };

        st.unshift([]);
        st.unshift(fObj);
        var strSt = JSON.stringify(st);
        dlFn("V7_stash_old.json", strSt);
      } else console.log("Can't find old stash storage");
    });
  }
}

function dlFn(filename, text) {
  var vLink = document.createElement("A"),
    vBlob = new Blob([text], {
      type: "application/octet-stream"
    }),
    vUrl = window.URL.createObjectURL(vBlob);
  vLink.setAttribute("href", vUrl);
  vLink.setAttribute("download", filename);
  vLink.click();
}
