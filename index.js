module.exports = function reee(d) {
  d.game.initialize('inventory');
  let delay = 50, lastUpdate

  function getId(arg) {
    try {
      return parseInt(arg) ? arg : arg.split('#####')[1].split('@')[0]
    } catch (e) { d.command.message(`${arg} is an invalid item id, please specify an id or link an item next time`); return false }
  }

  d.game.inventory.on('update', () => {
    let curTime = Date.now()
    if (lastUpdate > curTime || !d.settings.enabled) return;
    else lastUpdate = curTime + delay
    for (const [key, value] of Object.entries(d.settings.items)) {
      try {
        let item = d.game.inventory.find(parseInt(key))
        d.send('C_DEL_ITEM', 3, {
          gameId: d.game.me.gameId,
          pocket: item.pocket,
          slot: item.slot,
          amount: item.amount
        })
      } catch (e) { }
    }
  })

  d.command.add('trash', (arg, arg2) => {
    if (!arg) {
      d.settings.enabled = !d.settings.enabled
      d.command.message(`auto discard ${d.settings.enabled ? 'en' : 'dis'}abled`)
    }
    if (arg == 'add') {
      let id = getId(arg2)
      d.settings.items[id] = d.game.inventory.parent.data.items.get(parseInt(id)).name
      d.command.message(`added ${id} to be auto discarded`)
    }
    if (['rem', 'remove', 'delete', 'del'].includes(arg)) {
      let id = getId(arg2)
      delete d.settings.items[id]
      d.command.message(`removed ${id} from being auto discarded`)
    }
  })
}
