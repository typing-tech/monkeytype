import * as Misc from "./../misc";
import * as ActivePage from "./../states/active-page";
import * as Settings from "./../pages/settings";
import * as Account from "./../pages/account";
import * as ManualRestart from "./../test/manual-restart-tracker";
import * as PageTest from "./../pages/test";
import * as PageAbout from "./../pages/about";
import * as PageLogin from "./../pages/login";
import * as PageLoading from "./../pages/loading";

export let transition = true;

export function setTransition(val) {
  transition = val;
}

export function change(page) {
  if (transition) {
    console.log(`change page ${page} stopped`);
    return;
  }
  console.log(`change page ${page}`);

  if (page === "") page = "test";
  if (page == undefined) {
    //use window loacation
    let pages = {
      "/": "test",
      "/login": "login",
      "/settings": "settings",
      "/about": "about",
      "/account": "account",
    };
    let path = pages[window.location.pathname];
    if (!path) {
      path = "test";
    }
    page = path;
  }

  if (ActivePage.get() === page) {
    console.log(`page ${page} already active`);
    return;
  }

  const pages = {
    loading: PageLoading.page,
    test: PageTest.page,
    settings: Settings.page,
    about: PageAbout.page,
    account: Account.page,
    login: PageLogin.page,
  };

  const previousPage = pages[ActivePage.get()];
  const nextPage = pages[page];

  ActivePage.set(undefined);
  $(".page").removeClass("active");
  previousPage?.beforeHide();
  setTransition(true);
  Misc.swapElements(
    previousPage.element,
    nextPage.element,
    250,
    () => {
      setTransition(false);
      ActivePage.set(nextPage.name);
      previousPage?.afterHide();
      nextPage.element.addClass("active");
      history.pushState(nextPage.pathname, null, nextPage.pathname);
      nextPage?.afterShow();
    },
    () => {
      nextPage?.beforeShow();
    }
  );
}

$(document).on("click", "#top .logo", (e) => {
  change("test");
});

$(document).on("click", "#top #menu .icon-button", (e) => {
  if (!$(e.currentTarget).hasClass("leaderboards")) {
    const href = $(e.currentTarget).attr("href");
    ManualRestart.set();
    change(href.replace("/", ""));
  }
  return false;
});

$(".pageTest .loginTip .link").click(async (event) => {
  change("login");
});