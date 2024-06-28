


const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const productapi = await cds.connect.to('API_PRODUCT_SRV');

    this.on('READ', 'Products', async req => {
        req.query.SELECT.columns = [
            { ref: ['Product'] },
            { ref: ['ProductType'] },
            { ref: ['ProductGroup'] },
            { ref: ['BaseUnit'] },
            { ref: ['to_Description'], expand: ['*'] }
        ];
        let res = await productapi.run(req.query);

        res.forEach(element => {
            element.to_Description.forEach(item => {
                if (item.Language === 'EN') {
                    element.ProductDescription = item.ProductDescription;
                }
            });
        });

        return res;
    });

    this.before('READ', 'ProductLocal', async req => {
        const { Products, ProductLocal } = this.entities;
        const qry = SELECT.from(Products)
            .columns([
                { ref: ['Product'] },
                { ref: ['ProductType'] },
                { ref: ['ProductGroup'] },
                { ref: ['BaseUnit'] },
                { ref: ['to_Description'], expand: ['*'] }
            ])
            .limit(1000);
        let res = await productapi.run(qry);

        res.forEach(element => {
            element.to_Description.forEach(item => {
                if (item.Language === 'EN') {
                    element.ProductDescription = item.ProductDescription;
                }
            });
            delete element.to_Description;
        });
        const insqry = UPSERT.into(ProductLocal).entries(res);
        await cds.run(insqry);
    });

    this.before('UPDATE', 'ProductLocal', async req => {
        const { ProductDescription } = this.entities;
        console.log(req.data);
        console.log("Fired Update");

        console.log(req.data);
        const updqry = UPDATE(ProductDescription)
            .data({ "ProductDescription": req.data.ProductDescription })
            .where({ Product: req.data.Product, Language: 'EN' });
        await productapi.run(updqry);
    });

    this.before('CREATE', 'ProductLocal', async req => {
        const { Products, ProductLocal, ProductDescription } = this.entities;
        console.log(req.data);
        console.log("Fired Insert");
    
        
            const insqry = INSERT.into(Products).entries({
                "Product": req.data.Product,
                "ProductType": req.data.ProductType,
                "BaseUnit": req.data.BaseUnit,
                "to_Description": [
                    {
                        "Product": req.data.Product,
                        "Language": "EN",
                        "ProductDescription": req.data.ProductDescription
                    }
                ]
            });
    
            await productapi.run(insqry);
        
    });

})
   