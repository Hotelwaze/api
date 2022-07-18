import {Op} from 'sequelize'
import common from '../helpers/common'
import model from '../models'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import paymongoService from '../services/paymongo.service'
import {v4 as uuid} from 'uuid'
import admin from 'firebase-admin';

const {Booking, Car, Partner, CarModel, CarMake, CarType, Fee, CarBooking, Place, Invoice, InvoiceItem, User} = model;

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "hotel-waze",
    "private_key_id": "c50b24d93d56d035086460aa212d5d6f982b32e3",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAyhKf1LiGFDnf\nqvXGcDqTFSp6ta1B0wuCEgH03RgkHYJcIUeUExRIYN3yFUSwL5RJcf1zZqN0I6tD\n7CdQMdhlhGHaR1a5oXmU2o6vT8rsC5ZwnlmmFUdajQASbDo/PSbbyiyWXqQsdCwq\n+gbIWQbucahg4GKyDwP6Kug7HXUkPI0dyT0NglwxSWT8HL5ibFzHtRb9DEXJuIq4\nVATjQrqGWz23RwAd3MLx23qz3ELzh3Hd3rt0czxDbT/I3auAl4OLJNYIq7N2t0r4\nLzLCHVLRiNlZNiQSIokUG8kkdDqoZhrRmQD/254hw5nCwhJq8Zw1fe1b/uS0Munc\nm9od1FvTAgMBAAECggEAA53GwP4Z1/9ZITubu0qE+W1UNqkMbvJT15oZifZRFZxY\nGFJSKBI+NygErHMprq8LIQrlA4fRWRmyL2amoM0j5K5EXPZ+8fciyLVbfSkKAr4q\nPEKRe+66P+s/18NKnxUOkuDf+pIb55mQ791wyHajDVCkepdll+F1jvkZvMIjXbfx\n+EKqYu/bCo3b6SJZQyXWyQnJwBjewJgenWDzXDYfqEsQVJ3qCWbSf9mIMQ3Re6PX\ncA3q9bAPjfSlf3oW2omudslelxYsFHLdRbhpOsFnaDDcQV5IdYQg1qxLN4NqoZh+\n6mcX18OsJ47MrRR6dP0u+/NDldtNJRXM8ikV8bE6AQKBgQD/tYzKZ16AVe7ugLWG\nmgtYjFINqiYVyU9ZWRNWSz21Iqi9CUzkBa5/RYf7MTK5aZanzDSsHOOLfFdx177M\nZD9thfQJXGJXnlAemigJdtMyaX9/yEPIAmhmPfiK2+Nyh8cDe1DKd36UdjpVX7Tt\nJHZIrZjEYfvqoedOmSBg/QeBswKBgQDBAjQfS7ZT27ihc2+amED2BxFhOetsyAD1\nXR81kihPk3FmpXUdWPlAnii68iO7xM5GNBbUSH5+qDkuQ2SiLFY2IYvcrqBwZsiM\n3sm9dYAY2u5S/l7SG4tG52Tuos+kGU52zYi3moMX/am0TtHSyIANUzo4SsOZ6+ur\nYDaXpbFtYQKBgQCywEHkN7Bq/CdjWFwM9OBbjPPLE5c+AZTTe54147EGT20vgDHc\n8E/ULlHpebHgxPwI3oovip5SIqCqN0vsa2Ofd1VpucgRQdz2F4NHYmYuxmrXc7JW\nPcCnQEjfIOl1ZY7sUybd8fxtYdxTU+0RHT0GfzvchDZrBbTBT++/fQHjWwKBgQCk\nBIhgtAmMd+MNqLiFyq8hpF37nqnXNpvB51HXR45kGWs8DI1a1Dp01DLOs2j0b0nP\n1QI1gimk3rZA/1psinr040skzW1gN6hkNguAqnKiLKJs+ud/a5LPPWLDfK4xyKOq\nR/3P8UlIQPNPW8/pbSOMr1aBcd+JVThf2ZJrCo6d4QKBgBYnewZjqYZ6jH9VFG1b\nvVnRds4JYWduoGxK8IVvewX/9MbDHt1tAmGfkiySIGnGufMlQXp2DnTKKjFLYyAy\npiGJmcIJrNZUNVCpVj4ykTfOyRvrnbRPhVop1jPvi/KN4UwzZ4uP8QAW6zm9gKAa\nHJYPV1USyUTtpZxrRexn0zn5\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-idg81@hotel-waze.iam.gserviceaccount.com",
    "client_id": "118441291244053953770",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-idg81%40hotel-waze.iam.gserviceaccount.com"
  }),
  // The database URL depends on the location of the database
  databaseURL: "https://hotel-waze-default-rtdb.asia-southeast1.firebasedatabase.app"
});


const sample = async (req, res) => {

  // Initialize the app with a service account, granting admin privileges


  const db = admin.database();

  const refBooking = db.ref("bookings");

  await refBooking.set({
    1: true
  });
}

const updateBookingStatus = async (req, res) => {
  try {
    const {
      bookingId,
      status
    } = req.body

    const bookingData = await Booking.findOne({
      where: {
        id: bookingId
      }
    });

    if (bookingData) {
      const currentStatus = bookingData.status;

      if (status === 'booked') {
        //capture payment
        console.log(bookingData, "++++++++++++++++++++++++++++++++++++++");

        const intentId = bookingData.paymentIntentId;
        const args = {
          "data": {"attributes": {"amount": bookingData.totalPrice * 0.20}}
        }
        const capture = await paymongoService.create(`payment_intents/${intentId}/capture`, args);

        console.log(capture, "++++++++++++++++++++++++++++++++++++++");

        bookingData.update({
          status: 'booked'
        })

        bookingData.save();

        if (capture) {
          res.status(200).send({
            message: 'Booking Updated to Booked',
          });
        } else {
          res.status(500).send({
            message: 'Something Went Wrong in capturing payment',
          });
        }
        return;
      }
      ;

      bookingData.update({
        status
      });

      bookingData.save();
    }


  } catch (e) {
    console.log(e.message)
  }
}

const createBooking = async (req, res) => {


  const {
    CarTypeId, startDate, endDate, UserId, PartnerId, extraFees,
    bookingNotes, placeDescription, placeId, lat, lng, withDriver
  } = req.body


  try {

    console.log('202020');
    if (!UserId) {
      const error = new Error('UserId is required.')
      error.code = 403
      throw error
    }

    // Check if user has existing pending, booked, or active bookings,
    // if there is, user cannot request for a booking.
    const currentBookings = await Booking.findAll({
      where: {
        UserId,
        status: {
          [Op.or]: ['pending', 'booked', 'active']
        }
      }
    })

    if (currentBookings.length > 0) {
      const error = new Error(`You have a ${currentBookings[0].status} booking with reference id ${currentBookings[0].ref}. Complete that booking or cancel it before making another booking`)
      error.code = 403
      throw error
    }

    if (!startDate && !endDate) {
      const error = new Error('Missing booking start and end date.')
      error.code = 403
      throw error
    }

    const bookedPartnerCars = await Car.findAll({
      include: [
        {
          model: Partner,
          as: 'partner',
          where: {
            id: PartnerId,
          },
          required: true,
        },
        {
          model: Booking,
          as: 'bookings',
          required: true,
          where: {
            [Op.or]: [{
              startDate: {
                [Op.between]: [common.toJSDate(startDate), common.toJSDate(endDate)],
              },
            }, {
              endDate: {
                [Op.between]: [common.toJSDate(startDate), common.toJSDate(endDate)],
              },
            }],
          },
        },
      ],
    })

    const bookedPartnerCarIds = []

    if (bookedPartnerCars.length > 0) {
      bookedPartnerCars.forEach((bookedPartnerCar) => {
        bookedPartnerCarIds.push(bookedPartnerCar.id)
      })
    }

    const allPartnerCars = await Car.findAll({
      include: [
        {
          model: Partner,
          as: 'partner',
          where: {
            id: PartnerId,
          },
        },
        {
          model: CarModel,
          as: 'model',
          required: true,
          include: [
            {
              model: CarType,
              as: 'carType',
              required: true,
              where: {
                id: CarTypeId,
              },
            },
          ],
        },
      ],
    })

    let filteredPartnerCars = _.remove(allPartnerCars, (car) => !bookedPartnerCarIds.includes(car.id))

    filteredPartnerCars = JSON.stringify(filteredPartnerCars)
    filteredPartnerCars = JSON.parse(filteredPartnerCars)

    await model.sequelize.transaction(async (t) => {
      const bookingDays = moment(new Date(endDate)).diff(moment(new Date(startDate)), 'days')
      let fees = []

      if (extraFees) {
        const feesArgs = []
        extraFees.forEach((extraFee) => {
          feesArgs.push({
            id: extraFee,
          })
        })

        fees = await Fee.findAll({
          where: {
            [Op.or]: feesArgs,
          },
        })
      }


      let amount = 0
      const bookingFees = []

      if (fees.length > 0) {
        fees.forEach((fee) => {
          if (fee.type === 'recurring') {
            amount += fee.value * bookingDays
            bookingFees.push({
              amount: fee.value * bookingDays,
              currency: 'PHP',
              description: fee.name.replace('_', ' '),
              startDate: new Date(startDate),
              endDate: new Date(endDate)
            })
          } else {
            amount += fee.value
            bookingFees.push({
              amount: fee.value,
              currency: 'PHP',
              description: fee.name.replace('_', ' '),
              startDate: new Date(startDate),
              endDate: new Date(endDate)
            })
          }
        })
      }


      bookingFees.push({
        amount: filteredPartnerCars[0]?.model?.carType.pricePerDay * bookingDays,
        currency: 'PHP',
        description: `Vehicle rental for ${bookingDays} day/s.`,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      })

      // the amount of car price
      amount += filteredPartnerCars[0]?.model?.carType?.pricePerDay * bookingDays

      //add the gas price
      amount += 1000 + amount;

      //add driver fee

      if (withDriver === true) {
        amount += amount + (2000 * bookingDays);
      }

      // create booking
      const booking = await Booking.create({
        ref: uuid(),
        startDate,
        endDate,
        totalPrice: amount,
        notes: bookingNotes,
        paymentIntentId: "",
        UserId,
        status: 'pending',
        withDriver: withDriver,
        PartnerId,
      }, {transaction: t});


      const downPayment = amount * 0.20;

      console.log(booking, "YO MAMAMSA")

      const args = {
        data: {
          attributes: {
            payment_method_allowed: [
              'card',
            ],
            payment_method_options: {
              card: {
                request_three_d_secure: 'any',
              },
            },
            currency: 'PHP',
            capture_type: "manual",
            description: "Down payment For Booking # " + booking.id,
          },

        },
      }

      args.data.attributes.amount = downPayment;


      const paymentIntent = await paymongoService.create('payment_intents', args)

      console.log(paymentIntent.data)

      if (paymentIntent) {
        Booking.update({
            paymentIntentId: paymentIntent.data.data.id,
          },
          {
            where: {
              id: booking.id
            }
          });

        // assign car to booking
        await CarBooking.create({
          carId: filteredPartnerCars[0].id,
          bookingId: booking.id,
          price: filteredPartnerCars[0]?.model?.carType?.pricePerDay,
        }, {transaction: t})


        // set pickup/drop-off location
        await Place.create({
          description: placeDescription,
          placeId,
          placeableType: 'booking',
          placeableId: booking.id,
          coordinates: {type: 'Point', coordinates: [Number(lng), Number(lat)]},
        }, {transaction: t})


        // generate invoice and invoice items
        const invoice = await Invoice.create({
          number: uuid(),
          status: 'open',
          ref: paymentIntent.data.data.id,
          currency: 'PHP',
          BookingId: booking.id
        }, {transaction: t})


        bookingFees.forEach((fee, index) => {
          bookingFees[index].InvoiceId = invoice.id
        })

        await InvoiceItem.bulkCreate(bookingFees, {transaction: t})

        const db = admin.database();

        const refBooking = db.ref("bookings");
        await refBooking.set({
          [PartnerId]: true
        });

        res.status(200).send({
          message: 'Payment intent creation successful',
          data: paymentIntent.data.data,
        })
      } else {
        console.log('DELETE THE BOOKING HERE')
      }
    })

  } catch (err) {
    console.log(err, 'BEST')
    res.status(err.code || 500).send({
      message: err.message,
    })
  }
}

const getCurrentUserBooking = async (req, res) => {
  const {UserId} = req.query
  const args = {
    where: {
      status: {
        [Op.or]: ['pending', 'booked', 'active']
      }
    },
    include: [
      {
        model: Car,
        as: 'cars',
        include: [
          {
            model: CarModel,
            as: 'model',
            include: [
              {
                model: CarMake,
                as: 'make'
              },
              {
                model: CarType,
                as: 'carType'
              }
            ]
          },
          {
            model: Partner,
            as: 'partner'
          }
        ]
      },
      {
        model: Place,
        as: 'places'
      }
    ]
  }

  try {
    if (UserId !== undefined && UserId !== null && UserId !== '') {
      args.where.UserId = UserId
    } else {
      const error = new Error('UserId is required.')
      error.code = 403
      throw error
    }

    const result = await Booking.findOne(args)

    res.status(200).send({
      message: 'Query successful',
      data: result,
    })
  } catch (error) {
    res.status(error.code || 500).send({
      success: error.success,
      message: error.message,
    })
  }
}

const getBookingHistory = async (req, res) => {
  const {userId} = req;

  const args = {
    where: {
      status: {
        [Op.or]: ['done', 'cancelled']
      }
    },
    include: [
      {
        model: Car,
        as: 'cars',
        include: [
          {
            model: CarModel,
            as: 'model',
            include: [
              {
                model: CarMake,
                as: 'make'
              },
              {
                model: CarType,
                as: 'carType'
              }
            ]
          },
          {
            model: Partner,
            as: 'partner'
          }
        ]
      },
      {
        model: Place,
        as: 'places'
      }
    ]
  }

  try {
    if (userId !== undefined && userId !== null && userId !== '') {
      args.where.UserId = userId
    } else {
      const error = new Error('UserId is required.')
      error.code = 403
      throw error
    }

    const result = await Booking.findAll(args)

    res.status(200).send({
      message: 'Query successful',
      data: result,
    })
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send({
      success: error.success,
      message: error.message,
    })
  }
}

const getBookingPartner = async (req, res) => {
  const {userId} = req;

  console.log(userId);

  const args = {
    where: {
      PartnerId: userId
    },
    include: [
      {
        model: Car,
        as: 'cars',
        include: [
          {
            model: CarModel,
            as: 'model',
            include: [
              {
                model: CarMake,
                as: 'make'
              },
              {
                model: CarType,
                as: 'carType'
              }
            ]
          },
          {
            model: Partner,
            as: 'partner'
          },

        ]
      },
      {
        model: Place,
        as: 'places'
      },
      {
        model: User,
        as: 'customer'
      }
    ]
  }

  try {
    if (userId !== undefined && userId !== null && userId !== '') {
      args.where.PartnerId = userId
    } else {
      const error = new Error('UserId is required.')
      error.code = 403
      throw error
    }

    const result = await Booking.findAll(args)

    res.status(200).send({
      message: 'Query successful',
      data: result,
    });

  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send({
      success: error.success,
      message: error.message,
    })
  }
}

const getBookingPartnerInfo = async (req, res) => {
  const {userId} = req;

  const args = {
    where: {
      id: req.body.id
    },
    include: [
      {
        model: Car,
        as: 'cars',
        include: [
          {
            model: CarModel,
            as: 'model',
            include: [
              {
                model: CarMake,
                as: 'make'
              },
              {
                model: CarType,
                as: 'carType'
              }
            ]
          },
          {
            model: Partner,
            as: 'partner'
          },

        ]
      },
      {
        model: Place,
        as: 'places'
      },
      {
        model: User,
        as: 'customer'
      }
    ]
  }

  try {
    if (userId !== undefined && userId !== null && userId !== '') {
      args.where.PartnerId = userId
    } else {
      const error = new Error('UserId is required.')
      error.code = 403
      throw error
    }

    const result = await Booking.findOne(args)

    res.status(200).send({
      message: 'Query successful',
      data: result,
    });

  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send({
      success: error.success,
      message: error.message,
    })
  }
}

const cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findOne({
      where: {
        id: req.body.id
      }
    });

    if (booking && booking.status === 'pending') {
      await booking.update({
        status: 'cancelled'
      }); // get invoice and set invoice to paid

      res.status(200).send({
        message: 'Booking Cancelled',
      })
    } else {
      res.status(202).send({
        message: 'Booking in progress cannot be cancelled',
      })
    }
  } catch (error) {
    res.status(error.code || 500).send({
      success: error.success,
      message: error.message,
    })
  }
}

export default {
  createBooking,
  getCurrentUserBooking,
  cancelBooking,
  getBookingHistory,
  getBookingPartner,
  getBookingPartnerInfo,
  updateBookingStatus,
  sample,
}
