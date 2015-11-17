Malachi
=======

Tiny event dispatcher factory for JavaScript DDD applications

![Malachi holding a message scroll](https://upload.wikimedia.org/wikipedia/commons/3/39/Duccio_di_Buoninsegna_066.jpg)


Status
------

This package is in an experimental stage. It has not tested been tested in any context except Meteor.


Install
-------

`meteor add thomasvanlankveld:malachi`


Usage
-----

### CQRS

The image below shows an architectural separation [proposed by Greg Young](https://youtu.be/whCk1Q87_ZI?t=5h18m9s). This architectural style has several business advantages.

![CQRS Magic triangle](https://cqrs.files.wordpress.com/2010/11/image34.png)

### Event dispatcher

Malachi is an event dispatcher factory, designed to provide a clear boundary between the *domain* and the *read model*.

Applications will generally only need one dispatcher.

```javascript
const dispatcher = malachi();
```

### Event signatures

Using Malachi, the event boundary is described using event signatures.

```javascript
function inventoryItemDisabled({itemId, userId}) {
  dispatcher.fire(inventoryItemDisabled, {itemId, userId});
}
```

Unlike other event dispatchers, Malachi forces these signatures to be declared as named functions. This allows intelligent editor to autocomplete their names and hint their properties. :D

### Domain

The *domain* developers will just call the event signatures directly.

```javascript
inventoryItemDisabled({itemId: _id, userId});
```

In context:

```javascript
/**
 * Inventory item factory
 *
 * @param {string} doc._id
 * @param {boolean} doc.enabled
 * @returns {Object}
 */
const inventoryItem = function({_id, enabled}) {

  return {

    /**
     * Disable the inventory item
     *
     * @param {string} The id of the user disabling the item
     */
    disable(userId) {
      if(!enabled) { throw new Error('Item is already disabled'); }
      inventoryItemDisabled({itemId: _id, userId});
    }
  };
};
```

The domain does not even need to know the dispatcher exists.

### Read model

The *read model* developers register their handlers.

```javascript
dispatcher.on(inventoryItemDisabled, inventoryViewData.inventoryItemDisabledHandler)
  .on(inventoryItemDisabled, userHistoryViewData.inventoryItemDisabledHandler);
```

This registration can be chained.

The context might look something like this:

```javascript
/**
 * Encapsulates data for the inventory view
 */
const inventoryViewData = {

  /**
   *
   */
  inventoryItemDisabledHandler({itemId}) {
    inventoryViewCollection.update({_id: itemId}, {enabled: false});
  }
};

/**
 * Encapsulates data for the user history view
 */
const userHistoryViewData = {

  /**
   *
   */
  inventoryItemDisabledHandler({itemId, userId}) {
    const item = inventoryViewCollection.find({_id: itemId});
    userHistoryCollection.insert({
      action: 'Disabled item',
      imgurl: item.imgurl,
      title: item.title,
      shortDescription: item.shortDescription,
      userId
    });
  }
};
```


Contributing
------------

- [Git workflow](http://danielkummer.github.io/git-flow-cheatsheet/)
- [Future](https://trello.com/b/PAhpa71B/malachi)
- [Issues](https://github.com/thomasvanlankveld/malachi)
