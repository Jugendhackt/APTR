class BrokenObject {
    constructor(objectAttrs) {
        this.objectId = objectAttrs.objectId;
        this.reason = objectAttrs.reason,
        this.occurredOn = objectAttrs.occurredOn,
        this.updatedOn = objectAttrs.updatedOn,
        this.resolvedOn = objectAttrs.resolvedOn,
        this.duration = objectAttrs.duration
    }
}

module.exports = BrokenObject;
