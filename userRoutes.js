const express = require('express');
const router = new express.Router();



router.get('/', (req, res) => {
    return res.json(global.items);
});

router.post('/', (req, res, next) => {
    try {
        if (!req.body) throw new ExpressError("You need to add a food item and a price", 400);
        if (!req.body.name) throw new ExpressError("You need to add a name", 400);
        global.items.push(req.body);
        let newItem = {name: req.body.name, price: req.body.price}
        return res.status(201).json({added: newItem});
    } catch(err) {
        return next(err);
    }
    
})

router.get('/:name', (req, res, next) => {
    try {
        let name = req.params.name;
        if (!name || name.trim() === '') throw new ExpressError("You have an empty list", 400);
        for (let item of global.items) {
            if (item["name"] === name) {
                return res.status(200).json(item);
            }
        }
        throw new ExpressError("There is nothing in the list matching your input", 404);
    } catch(err) {
        next(err);
    }
})

router.patch('/:name', (req, res, next) => {
    try {
        let price = req.body.price;
        if (!req.params.name) throw new ExpressError("You did not search for anything", 400);
        for (let item of global.items) {
            if (item["name"] === req.params.name) {
                item["name"] = req.body.name;
            }
            if (req.body.price) {
                item["price"] = price;
            }
            return res.status(200).json({"updated": item});
        }
        throw new ExpressError("There is nothing in the list matching your input", 404);
    } catch(err) {
        next(err);
    }
})

router.delete('/:name', (req, res, next) => {
    try {
        let name = req.params.name;
        if (!name) throw new ExpressError("You did not search for anything", 400);
        for (let item of global.items) {
            if (item["name"] === name) {
                global.items = global.items.filter(item => item["name"] !== name);
                return res.status(200).json({"message": "Deleted"})
            }
        }
        throw new ExpressError(`${name} is not in the list`, 400);
    } catch(err) {
        next(err);
    }
})

class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message=message;
        this.status=status;
        console.error(this.stack);
    }
}



module.exports = router;