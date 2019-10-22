"use strict";

const Guid = require("guid");
const express = require("express");
const router = express.Router();

const DATABASE = {};
let ceo = undefined;

router.post("", function(req, res) {
    const employee = getEmployeeFromRec(req);
    if (ceo && employee.role === "CEO") {
        // return 422 if two ceos or employee with id exists
        res.status(422).send({ error: "There can be only one CEO." });
    } else if (DATABASE[employee.id]) {
        res.status(422).send({ error: "Employee with " + employee.id + " already exists" });
    } else {
        if (employee.role === "CEO") {
            ceo = employee;
        }
        DATABASE[employee.id] = employee;
        res.status(201).json(employee);
    }
});

router.put("/:id", function(req, res) {
    const employee = getEmployeeFromRec(req);
    if (ceo && employee.role === "CEO" && ceo.id !== employee.id) {
        // the employee is updated to be a CEO but there already a different CEO
        res.status(422).send({ error: "There can be only one CEO." });
    } else if (DATABASE[employee.id].etag !== employee.etag) {
        // the employee is record was updated by someone else in meanwhile
        res.status(422).send({ error: "You have outdated entry. Refresh the page before continuing." });
    } else {
        // if employe was a CEO and not anymore update it
        if (DATABASE[employee.id].role === "CEO" && employee.role !== "CEO") {
            ceo = undefined;
        }
        // if employe was a CEO and not anymore update it
        if (DATABASE[employee.id].role !== "CEO" && employee.role === "CEO") {
            ceo = employee;
        }
        DATABASE[employee.id] = employee;
        employee.etag++;
        res.send(employee);
    }
});

/* GET employees listing. */
router.get("/:id?", function(req, res) {
    if (req.params.id) {
        if (DATABASE[req.params.id]) {
            res.status(200).json(DATABASE[req.params.id]);
        } else {
            res.status(404).send({});
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
        if (ceo && ceo.id === req.params.id) {
            ceo = undefined;
        }
        delete DATABASE[req.params.id];
        return res.status(200).send({});
    }
    return res.status(404).send({ error: "Delete failed. Refresh the data and try again." });
});

function getEmployeeFromRec(req) {
    const employee = {
        id: req.body.id ? req.body.id : Guid.create().value,
        etag: req.body.etag ? req.body.etag : 0,
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
