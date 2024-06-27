namespace com.satinfotech.cloudapps;
using {cuid, managed} from '@sap/cds/common';

entity Kitchen: managed, cuid {
    @title:'Name'
    name: String(10);
    @title: 'Address 1'
    addr1: String(40);
    @title: 'Address 2'
    addr2: String(40);
    @title: 'City'
    city: String(40);
    @title: 'State'
    state: String(40);
    @title: 'PIN-Code'
    pincode: String(6);
    @title: 'Phone Number'
    phone: String(15);
}

entity ProductLocal: managed {

    @title: 'Product ID'
    @readonly
    key Product: String(40);
    @title:'Product Type'
    @readonly
    ProductType: String(4);
    @readonly
    @title: 'Base Unit'
    BaseUnit: String(3);
    @readonly
    @title: 'Product Group'
    ProductGroup: String(18);
    @title: 'Product Description'
    ProductDescription: String(40);
}

