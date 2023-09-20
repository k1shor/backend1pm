const Category = require('../models/categorymodel')

// to add category
exports.addCategory = async (request, response) => {
    let category = new Category({
        category_name: request.body.category_name
    })
    category = await category.save()
    if(!category){
        return response.status(400).json({error: "Something went wrong"})   
    }
    response.send(category)
}

/*
request.body - to input  data from users using body of a form
request.params - to input data using the url
    eg: /00123
request.query - to input data using url and variable
    eg: /search?id=12345 -> request.query.id

response.status(400).json({key:value}) - returns json
response.send(json)
response.json(json)
    status: 404 - page not found
            400 - bad request
            5.. - server related error

            200 - success
*/