const Category = require('../models/categorymodel')

// to add category
exports.addCategory = async (request, response) => {
    // let category = new Category({
    //     category_name: request.body.category_name
    // })
    // category = await category.save()

    // check if category already exists
    let categoryExists = await Category.findOne({ category_name: request.body.category_name })
    // if already exists, return error message
    if (categoryExists) {
        return response.status(400).json({ error: "Category already exists." })
    }
    // if not exists, add category and send response

    let category = await Category.create({
        category_name: request.body.category_name
    })
    if (!category) {
        return response.status(400).json({ error: "Something went wrong" })
    }
    response.send(category)
}

// to get all categories
exports.getAllCategories = async (req, res) => {
    let categories = await Category.find()
    if (!categories) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categories)
}

// to get category details
exports.getCategoryDetails = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id)
        // let category = await Category.findOne({_id: req.params.id})
        if (!category) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        res.send(category)
    }
    catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

// update category
exports.updateCategory = async (req, res) => {
    let category = await Category.findByIdAndUpdate(req.params.id, {
        category_name: req.body.category_name
    }, { new: true })
    if (!category) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(category)
}
// delete category
// exports.deleteCategory = async (req, res) => {
//     try {
//         let category = await Category.findByIdAndDelete(req.params.id)
//         if (!category) {
//             return res.status(400).json({ error: "Category not found" })
//         }
//         res.send({ message: "Category deleted Successfully" })
//     }
//     catch(error){
//         res.status(400).json({error:"Something went wrong"})
//     }
// }

exports.deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(category=>{
        if(!category){
            return res.status(400).json({ error: "Category not found" })
        }
        res.send({message:"Category deleted successfully"})
    })
    .catch(error=>{
        return res.status(400).json({error:error.message})
    })
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


C           Model.create({}) - to insert into database

R           Model.find() - returns all the data/document in array
            Model.find(filter) - returns all the data/document which matches filter in array 
                                        filter eg: {category_name: "mobile"}
            Model.findOne(filter) - returns first document that matches the filter
            Model.findById(id) - returns document with the given id

U           Model.findByIdAndUpdate(id, {updateObj}, {new:true} ) -
                    id - id of the document that needs to be updated
                    {updateObj} - fields that needs to be updated
                    {new:true} - returns updated document

D           Model.findByIdAndDelete(id) or Model.findByIdAndRemove(id)
                    removes document with the given id from database
*/