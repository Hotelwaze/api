import model from '../models'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config";

const {Sequelize} = require('sequelize')
const {Partner, PartnerType, Address, Place, User, RefreshToken} = model
import {Op} from 'sequelize'

const getPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll({
      attributes: [
        'id',
        'name',
        'registeredName',
        'tradeNumber',
        'taxNumber',
        'phone',
        'email',
        'status'
      ],
      include: [
        {
          model: PartnerType,
          as: 'partnerType',
        },
        {
          model: Address,
          as: 'addresses'
        },
        {
          model: Place,
          as: 'places'
        }
      ]
    })
    res.status(200).send({
      partners
    })
  } catch (err) {
    console.log(err)
  }
}

const getPartnerInfo = async (req, res) => {
  try {

    const {userId} = req;

    const user = await User.findOne({
      where: {
        id: userId,
      },
    })


    const partner = await Partner.findOne({
      where: {
        id: user.PartnerId
      },
      attributes: [
        'id',
        'name',
        'registeredName',
        'tradeNumber',
        'taxNumber',
        'phone',
        'email',
        'status'
      ],
      include: [
        {
          model: PartnerType,
          as: 'partnerType',
        },
        {
          model: Address,
          as: 'addresses'
        },
        {
          model: Place,
          as: 'places'
        }
      ]
    })
    res.status(200).send({
      partner
    })
  } catch (err) {
    console.log(err)
    res.status(200).send({
      success: false
    })
  }
}

const getPartnerInfoAdmin = async (req, res) => {
  try {

    const {id} = req.body;


    const partner = await Partner.findOne({
      where: {
        id: id
      },
      attributes: [
        'id',
        'name',
        'registeredName',
        'tradeNumber',
        'taxNumber',
        'phone',
        'email',
        'status'
      ],
      include: [
        {
          model: PartnerType,
          as: 'partnerType',
        },
        {
          model: Address,
          as: 'addresses'
        },
        {
          model: Place,
          as: 'places'
        }
      ]
    });


    res.status(200).send({
      success: true,
      partner
    });

  } catch (err) {
    console.log(err.message)
    res.status(500).send({
      success: false
    })
  }
}

const updatePartner = async (req, res) => {
  try {

    const {userId} = req;
    const {
      name,
      registeredName,
      status,
      phone,
      taxNumber,
      tradeNumber,
    } = req.body.data;

    const user = await User.findOne({
      where: {
        id: userId,
      },
    })


    await Partner.update({
        name,
        registeredName,
        status,
        phone,
        taxNumber,
        tradeNumber,
      },
      {
        where: {
          id: user.PartnerId,
        },
      })

    res.status(200).send({
      message: 'Updated',
      success: true
    });

  } catch (err) {
    console.log(err)
    res.status(200).send({
      success: false
    })
  }
}

const updatePartnerAdmin = async (req, res) => {
  try {


    const {
      id,
      name,
      registeredName,
      status,
      phone,
      taxNumber,
      tradeNumber,
      password,
      email
    } = req.body.data;

    const existingUser = await User.findOne({
      where: {name: name, id: {[Op.not]: id}},
    });
    const existingUserEmail = await User.findOne({
      where: {name: email, id: {[Op.not]: id}},
    });

    console.log(existingUser, "@)S)DAS)DA)SD)ADS")

    if (existingUserEmail?.id) {
      res.status(200).send({
        message: 'Error Duplicate Email',
        success: false,
      });

      return
    }
    if (existingUser?.id) {
      res.status(200).send({
        message: 'Error Duplicate Name',
        success: false,
      });

      return
    }

    const user = await User.findOne({
      where: {
        id,
      },
    })


    await Partner.update({
        name,
        registeredName,
        status,
        phone,
        taxNumber,
        tradeNumber,
      },
      {
        where: {
          id: user.PartnerId,
        },
      });

    user.update({
      email,
    })

    user.save();

    if (password) {
      user.update({
        password: bcrypt.hashSync(password, 11),
      })
      user.save();
    }

    res.status(200).send({
      message: 'Updated',
      success: true
    });

  } catch (err) {
    console.log(err)
    res.status(200).send({
      success: false
    })
  }
}

const addPartner = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      registeredName,
      status,
      phone,
      taxNumber,
      tradeNumber,
    } = req.body.data;

    console.log(name,
      email,
      password,
      registeredName,
      status,
      phone,
      taxNumber,
      tradeNumber,);

    let partnerId = '';

    await model.sequelize.transaction(async (t) => {

      const existingUser = await User.findOne({
        where: {name: name},
      });
      const existingUserEmail = await User.findOne({
        where: {email: email},
      });

      console.log(existingUser, "@)S)DAS)DA)SD)ADS")

      if (existingUserEmail?.id) {
        res.status(200).send({
          message: 'Error Duplicate Email',
          success: false,
        });

        return
      }
      if (existingUser?.id) {
        res.status(200).send({
          message: 'Error Duplicate Name',
          success: false,
        });

        return
      }

      const partner = await Partner.create({
        name,
        registeredName,
        status,
        email,
        phone,
        taxNumber,
        tradeNumber,
        PartnerTypeId: 1,
      });

      console.log(partner);

      let args = {
        email,
        password: bcrypt.hashSync(password, 11),
        name,
        status: 'active',
        PartnerId: partner.id
      }

      partnerId = partner.id;

      await Place.create({
        description: '17 Mamerto District,Rosario Pasig',
        placeId: '17-Mamerto-District-Rosario-Pasig',
        coordinates: Sequelize.fn('ST_GeomFromText', 'POINT(121.083635 14.5889289)'),
        placeableId: partner.id,
        placeableType: 'partner',
      },)

      const user = await User.create(args, {transaction: t});

      await user.setRoles([4], {transaction: t});

      res.status(200).send({
        message: 'Updated',
        success: true,
        id: partner.id
      });
    });

  } catch (err) {
    console.log(err);
    res.status(200).send({
      success: false,
      message: "error " + err.message
    })
  }
}

const updatePartnerPlace = async (req, res) => {
  try {

    const {userId} = req;
    const {
      lat,
      lng,
      description,
      placeId,
    } = req.body.data;

    const user = await User.findOne({
      where: {
        id: userId,
      },
    })

    await Place.update({
        description,
        placeId,
        coordinates: Sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`),
      },
      {
        where: {
          placeableId: user.PartnerId,
          placeableType: 'partner'
        },
      });


    res.status(200).send({
      message: 'Updated',
      success: true
    });

  } catch (err) {
    console.log(err)
    res.status(200).send({
      success: false
    })
  }
}

const updatePartnerPlaceAdmin = async (req, res) => {
  try {


    const {
      id,
      lat,
      lng,
      description,
      placeId,
    } = req.body.data;

    const user = await User.findOne({
      where: {
        id: id,
      },
    })


    await Place.update({
        description,
        placeId,
        coordinates: Sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`),
      },
      {
        where: {
          placeableId: user.PartnerId,
          placeableType: 'partner'
        },
      });


    res.status(200).send({
      message: 'Updated',
      success: true
    });

  } catch (err) {
    console.log(err)
    res.status(200).send({
      success: false
    })
  }
}

const getPartnerList = async (req, res) => {
  try {

    const result = await Partner.findAll({
      include: [
        {
          model: PartnerType,
          as: 'partnerType',
        },
        {
          model: Address,
          as: 'addresses'
        },
        {
          model: Place,
          as: 'places'
        }
      ]
    },);

    res.status(200).send({
      partners: result,
      success: true
    });

  } catch (err) {
    console.log(err)
    res.status(200).send({
      success: false
    })
  }
}

const partnerController = {
  getPartners,
  getPartnerInfo,
  updatePartner,
  updatePartnerPlace,
  getPartnerList,
  addPartner,
  getPartnerInfoAdmin,
  updatePartnerAdmin,
  updatePartnerPlaceAdmin,
}

export default partnerController
