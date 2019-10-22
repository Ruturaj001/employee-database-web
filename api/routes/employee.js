"use strict";

const Guid = require("guid");
const express = require("express");
const router = express.Router();

const DATABASE = {};

router.post("", function(req, res) {
    // return 422 if two ceos
    const employee = getEmployeeFromRec(req);
    DATABASE[employee.id] = employee;
    return res.status(201).json(employee);
});

router.put("/:id", function(req, res) {
    const employee = getEmployeeFromRec(req);
    DATABASE[employee.id] = employee;
    return res.send(employee);
});

/* GET employees listing. */
router.get("/:id?", function(req, res) {
    if (req.params.id) {
        if (DATABASE[req.params.id]) {
            res.status(200).json(DATABASE[req.params.id]);
        } else {
            res.status(404).end();
        }
    } else {
        res.status(200).json(
            Object.keys(DATABASE).map(function(key) {
                return DATABASE[key];
            })
        );
    }
});

router.delete("/:id", function(req, res) {
    if (DATABASE[req.params.id]) {
        delete DATABASE[req.params.id];
        return res.status(200).send(true);
    }
    return res.status(200).send(false);
});

function getEmployeeFromRec(req) {
    const employee = {
        id: req.body.id ? req.body.id : Guid.create().value,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        hireDate: req.body.hireDate,
        role: req.body.role,
        favoriteJoke: req.body.favoriteJoke,
        favoriteQuote: req.body.favoriteQuote
    };

    return employee;
}

module.exports = router;
