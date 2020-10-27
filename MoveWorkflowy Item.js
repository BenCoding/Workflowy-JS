(function moveToStar_1_7(top = true) {
  function toastMsg(str, sec, err) {
    WF.showMessage(str, err);
    setTimeout(() => WF.hideMessage(), (sec || 2) * 1000);
  }
  // returns star items sorted, excludes completed and embedded content
  function getUniqueStarsForMove() {

    let pIDs = new Set();

    WF.starredItems().forEach(item => { 
        if (!item.isCompleted() && item.treeId === "main" && !item.isAddedSubtreePlaceholder()) pIDs.add(item.projectid)
       });

    let stars = [];

    pIDs.forEach(pID => stars.push(WF.getItemById(pID)));

    return stars.sort((a, b) => a.getNameInPlainText().localeCompare(b.getNameInPlainText()));
  }
  function moveTo(items, targetPid, Go) {

    WF.hideDialog();
    const target = WF.getItemById(targetPid);
    // Prevent moving embedded items and moving items into themselves
    const viableMoves = items.filter((item) => !item.equals(target) && item.treeId === "main");

    if (viableMoves.length > 0) {
      
      const pty = top ? 0 : target.getChildren().length;
      const current = WF.currentItem();
      const parent = current.getParent() || WF.rootItem();
      const lastMove = viableMoves[viableMoves.length - 1];
      const firstMove = viableMoves[0];
      const next = lastMove.getNextPotentiallyVisibleSibling();
      const prev = firstMove.getPreviousPotentiallyVisibleSibling();

      WF.moveItems(viableMoves, target, pty);
      let setFocus;

      // just go, no message
      if (Go) {
        WF.zoomTo(target);
        if (focus) WF.editItemName(focus);
      } else {
        // Create move message
        const link = `<b><a href="${target.getUrl()}">${htmlEscapeText(target.getNameInPlainText())}</a></b>`;
        toastMsg(`Moved <b>${viableMoves.length}</b>${arrow + link}`, 3);
        // Set cursor focus after move
        if (lastMove.projectid === current.projectid) {
          setFocus = parent.isMainTreeRoot() ? parent.getPotentiallyVisibleChildren()[0] : parent;
          WF.zoomTo(parent);
        } else if (next) {
          setFocus = next
        } else if (prev) {
          setFocus = prev
        } else {
          setFocus = current
        }
        WF.editItemName(setFocus);
      }
    } else {
      toastMsg("Not a legal move...", 3, true)
    }
  }
  function createSelectBox(items) {
    const options = items.map((item, i) => {
      let value = `"${item.projectid}"`;
      if (i === 0) value = `${value} selected`;
      return `<option value=${value}>${htmlEscapeText(item.getNameInPlainText())}</option>`;
    });
    return `<select id="moveSelect" size="${options.length}">${options.join('')}</select>`;
  }

    const arrow = top ? " ▲ " : " ▼ ";
    const focus = WF.focusedItem();
    const selections = WF.getSelection();

  if (focus) selections.push(focus);

  if (selections.length > 0) {
    const moveInfo = selections.length === 1 ? `${WF.getItemById(selections[0].projectid).getNameInPlainText()}` : `${selections.length} items`;
    const style = `<style>select{font-size:14px;border:hidden;margin-top:6px;width:460px;}option::before{content:"●  "!important;color:#c6c6c6!important}h1{font-size:120%!important}</style>`;
    WF.showAlertDialog(style + createSelectBox(getUniqueStarsForMove()), `Move${arrow + moveInfo}`);
    
    setTimeout(function () {
      const moveSelect = document.getElementById("moveSelect");
      moveSelect.focus();
      moveSelect.onclick = function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey) {
          if (!e.shiftKey) moveTo(selections, this.value);
          if (e.shiftKey) moveTo(selections, this.value, true);
        }
      };
      moveSelect.onkeyup = function (e) {
        if (!e.altKey && !e.ctrlKey && !e.metaKey && e.key === "Enter") {
          if (!e.shiftKey) moveTo(selections, this.value);
          if (e.shiftKey) moveTo(selections, this.value, true);
        }
      };
    }, 100);

  } else {
    toastMsg("No bullets selected or focused", 2, true);
  }
})();

