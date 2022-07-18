import {Op} from 'sequelize'
import common from '../helpers/common'
import model from '../models'
import * as _ from 'lodash'
import moment from 'moment-timezone'
import paymongoService from '../services/paymongo.service'
import {v4 as uuid} from 'uuid'
import admin from 'firebase-admin';
import serviceAccount from '../config/firebase.json'
const {Booking, Car, Partner, CarModel, CarMake, CarType, Fee, CarBooking, Place, Invoice, InvoiceItem, User} = model;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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

        if(capture) {
          res.status(200).send({
            message: 'Booking Updated to Booked',
          });
        }else{
          res.status(500).send({
            message: 'Something Went Wrong in capturing payment',
          });
        }
        return;
      };

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

      if(withDriver === true) {
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
