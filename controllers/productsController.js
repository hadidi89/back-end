const express = require('express')
const controller = express.Router()
let products = require('../data/simulated_database')
const productSchema = require('../schemas/productSchema')
let request = require('request');

// *********************************************************************

controller.param("id",  (req, res, next, id) => {
    req.product = products.find(product => product.id == id)
    next()

})
controller.param('tag', (req, res, next, tag) => {
    req.products = products.filter(product => product.tag == tag)
    next()
})
// -------------------------------------------------------------------------

// HÄMTA ALLA PRODUKTER 
controller.get('/', async (req, res) => {
    const products = []
    const list = await productSchema.find()
    if(list){
        for(let product of list){
            products.push({
                id: product._id,
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                imageName: product.imageName,
                tag: product.tag,
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})


// HÄMTA TAG 
controller.get('/:tag', async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag })
    if(list){
        for(let product of list){
            products.push({
                id: product._id,
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                imageName: product.imageName,
                tag: product.tag,
            })
        }
        res.status(200).json(products)
    } else
        res.status(400).json()
})

// HÄMTA BELOPP PRODUKTER
controller.get('/:tag/take=:amount', async (req, res) => {
    const products = []
    const list = await productSchema.find({ tag: req.params.tag }).limit(req.params.amount)
    if(list){
        for(let product of list){
            products.push({
                id: product._id,
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                imageName: product.imageName,
                tag: product.tag,
            })
        }   
        res.status(200).json(products)
    } else
        res.status(400).json()
})

// HÄMTA SPECIFIKT ANTAL PRODUKTER
controller.get('/details/:id', async (req, res) => {
    const product = await productSchema.findById(req.params.id)
    if(product){
        res.status(200).json({
            id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            imageName: product.imageName,
            tag: product.tag,           
        })
    } else
        res.status(404).json()
})
// ----------------------------------------------------
// SECURED ROUTES
// CREATE AND POST PRODUKTER
controller.post('/', async (req, res) => {

    const { name, category, description, price, tag, imageName } = req.body

    if( !name || !price )
        res.status(400).json({text: 'Name and price are required.'})

    const product_exists = await productSchema.findOne({name})
    if(product_exists)
        res.status(409).json({text: 'A product with the same name already exists'})
    else{
        const product = await productSchema.create({
            name,
            category,
            description,
            price,
            tag,
            imageName
        })
        if(product)
            res.status(201).json({text: `The product with ID ${product._id} was created successfully.`})
        else
            res.status(400).json({text: 'Something went wrong, we try to create the product.'})
    }
})

// DELETE PRODUKTER  
controller.delete('/details/:id', async (req, res) => {

    if(!req.params.id)
        res.status(400).json('No ID was specified.')
    else{
        const product = await productSchema.findById(req.params.id)
        if(product){
            await productSchema.deleteOne(product)
            res.status(200).json({text: `The product with ID ${req.params.id} was deleted successfully.`})
        } else{
            res.status(404).json({text: `The product with ID ${req.params.id} was not found.`})
        }
    } 
})

// -----------------------------------------------------------------

// UPDATE AND PUT PRODUKTER
controller.put('/details/:id', async (req, res) => {

    const id = req.params.id
    const updates =
    {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        imageName: req.body.imageName
    }

    const product = await productSchema.findByIdAndUpdate(id, updates, { new: true})

    if(product)
        res.status(200).json(product)
    else
        res.status(404).json({text: `The product with ID ${req.params.id} was not found.`})
})

// ----------------------------------------------------------------------------------------------------


//  controller.put('/details/:id', async (req, res) => {
//     const { name, category, imageName, price } = req.body

//     const item = await productSchema.findById(req.params.id)
//     if (product)
//     {
//         const product = await productSchema.findOneAndUpdate({
//             name : name ? name : product.name,
//             category : category ? category : product.category,
//             imageURL: imageName ? imageName : product.imageName,
//             price: price ? price : product.price
//         })
//         if (product)
//               res.status(200).json(product)
//         else
//              res.status(404).json({text: `The product with ID ${req.params.id} was not found.`})
//     }
// })




module.exports = controller















// // http://localhost:5000/api/products
// controller.route('/')
// .post ((httpRequest, httpResponse) => {

//     let product = {
//         id: (products[products.length-1])?.id > 0 ? (products[products.length-1])?.id + 1 : 1,
//         // articleNumber: request.body.articleNumber,
//         name: httpRequest.body.name,
//         price: httpRequest.body.price,
//         category: httpRequest.body.category,
//         description: httpRequest.body.description,
//         imageName: httpRequest.body.imageName
//     }
    
//     products.push(product)
//     httpResponse.status(201).json(product)
    
// })
// .get ((httpRequest, httpResponse) => {
//     httpResponse.status(200).json(products)
// })

// // http://localhost:5000/api/products/take=:amount
// // HÄMTA SPECIFIKT ANTAL PRODUKTER

// controller.get('/take=:amount', (httpRequest, httpResponse) => {
//     httpResponse.status(200).json(httpRequest.products)
// }) 

// // http://localhost:5000/api/products/{id}
// controller.route('/details/:id')
// .get((httpRequest, httpResponse) => {
//     if (httpRequest.product != undefined) {
//         httpResponse.status(200).json(httpRequest.product)
//     }
   
//     else
//     httpResponse.status(404).json()
// })

// controller.put('/details/:id',(httpRequest, httpResponse) => {
//     if (httpRequest.product != undefined) {
//       products.forEach(product => {
//       if (product.id == httpRequest.product.id) {
//         // product.articleNumber = request.body.articleNumber ? request.body.articleNumber : product.articleNumber
//         product.name = httpRequest.body.name  ? httpRequest.body.name : product.name
//         product.price = httpRequest.body.price ? httpRequest.body.price : product.price
//         product.category = httpRequest.body.category ? httpRequest.body.category : product.category
//         product.description = httpRequest.body.description ? httpRequest.body.description : product.description
//         product.imageName = httpRequest.body.imageName ? httpRequest.body.imageName : product.imageName
//       }
//       })
//       httpResponse.status(200).json(httpRequest.product)
//     }
   
//     else
//     httpResponse.status(404).json()


// })
// .delete('/details/:id', (httpRequest, httpResponse) => {
//     if (httpRequest.product != undefined) {
//         products = products.filter(product => product.id !== httpRequest.product.id)
//         httpResponse.status(204).json()
//     }
   
//     else
//     httpResponse.status(404).json()
    
// })

// // http://localhost:5000/api/products/:tag
// // HÄMTA EN SPECIFIK PRODUKT TAG
// controller.get('/:tag', (httpRequest, httpResponse) => {
//     if (httpRequest.products != undefined)
//         httpResponse.status(200).json(httpRequest.products)
//     else
//         httpResponse.status(404).json()
// })

// // http://localhost:5000/api/products/:tag/take=:amount
// // HÄMTA EN SPECIFIK PRODUKT TAG
// controller.get('/:tag/take=:amount', (httpRequest, httpResponse) => {
//     let list=[]

//     for (let i = 0; i < Number(httpRequest.params.amount); i++) {
//         list.push(httpRequest.products[i])
//     }

//     if (httpRequest.products != undefined)
//         httpResponse.status(200).json(list)
//     else
//         httpResponse.status(404).json()
// })




// module.exports = controller

