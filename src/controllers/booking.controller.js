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
      "private_key_id": "a97ee617d49c07577e308d17799fa1e0c8fa35e4",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDE6DV/9OFPTvg9\n9AJfk5ig4hUhg5TGzNX2DzlFqNI2bZ3QK3z7EaZ7ZrWXD5GKgswf0jWIXCu5N+6K\n2BdsjnGB9bO3rgAiDaxz0KlFU27upUMrgD+CuxN0wV8qIjd3lE6Uf4VtcAW6Jdi7\nrDkCBbtXlZGm2XSDllvUuRWn7zCP5OCbQQgW39EjcoohYVyxtvPBtAXJzSGe2EHi\nnxD7AN7qVbxHPySeDFTPNo0VB2/WtJALb3VN/s2VMYNjOQZGGYrfXGVg6b+7q7qr\n39gXOnMPA592rMclxVbLsPAoBw7mfQzhuDS1IBjHfvtjyIY93lyYFl6YmnhtFE14\nXy4T5+1TAgMBAAECggEAOhekCQ8vFd3fgS+nL5l08yogP9X5I7m0+jY9mF6ZPjOS\n1qKt6cioTEneEyYlsy6pmE3FO2iuAaQNvWrJZl6UAFqD3hH4uhM8qKKL/gcCeGfL\nbF8W3bPhppWSRPT5Vk8r68W/kKz3E5cs3RmPbBhS0CExan9HT7chep3sVLJNqnXA\nj5Hjt2PwDbULV/HHA5rTbul+un17405i6v6pr9E24tP/MlSAvEOV6AkkNNA+8Bok\nbQAvtaK3PZC9Xh01sAds3I6yyn74hcXlk+YvcsGHM/v5PtwVrGH4KCQ6Mq0QWN5E\nsPLp/bj7rzYLllO2bm/kc2FrxihmF4QHC4w1EsTc2QKBgQDhMSblCoJgCEh8JXNp\nOtRlshCkeesFVzkSuNcMtDlAsu7evSHmsWk3a2PnMg7HLXe/QqZQ8G7wV4M2clap\nEIY9Zn2+phhenZUd03g7OsU8nt9GO6dDzPKTLnABGGrLIB2g3v1pfLGhHzVv1TbX\nPs/ua33K9u4jQqyURBo21HmwDQKBgQDf2HC2BkQN7Z3W/17Pte/mjI+Qco5+TM7w\nVU66I1ZCULtgo9gPj2UpVm+zU3e3J4/Fm4/r7LkYkRTVdoYHgIbifcLeYDs4uZbh\nJCRcaJD9v/OpQbre7Gq93dWeAWnVFmAW+p5eKlggMJX71EZjuTx+oNIM7lGRSmsh\ny2B76k9a3wKBgGOwMpuqL1T71bq/iXvIA0aRsTRelF/k4Osc0HZbQg0WKRCJgXxy\nhTV3YN50Fn6t7hjJFH84MKRM2VU9AIgPPJ3pxTikpp0b/WsatlriBXZ0jjq1JbKq\nA6iMIiEaAgyxxuv0SxJrlObSvgEnzgMzVzEgfKtg7MLHPUbVbxVesg/xAoGAMP/m\nHFJez1W2eXvJO1quOx+Fxa7t9kPGAOILq79UgIu/mLYE89MF5/id1vlseVFVrYIS\nDSjyk6gekWOyjy3ZWPcCkz8pd49YscwBkaDqLEG6itByoZ3K9+j5e+7/Rb/yJNWT\nmTVXuSQpkMi059uCnI2DrYT1ogJSVUF5y2ZNHK0CgYEAv/Uvkl4DoiBFtCP49cOM\nGWjcvVSIDb1BcRYGUBu1S/1VyMq93DMqQWA2wu9UnwkVTF9XPbQ9zC+voUrpKJlK\nLjvkFBmoPRCT5c/mDJhYEbj8XblfcV9an7/k7hsMlqdGNTVhbmlD5K/cTyu+6NQ1\nd4OpPybB/b0Bbhamp6yuYww=\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-idg81@hotel-waze.iam.gserviceaccount.com",
      "client_id": "118441291244053953770",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-idg81%40hotel-waze.iam.gserviceaccount.com"
    }
  ),
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

    const userData = await User.findOne({
      where: {
        id: bookingData.UserId
      }
    });

    if (bookingData) {

      const currentStatus = bookingData.status;

      if (status === 'booked') {
        //capture payment
        console.log(bookingData, "++++++++++++++++++++++++++++++++++++++");

        const intentId = bookingData.paymentIntentId;
        //100%
        const args = {
          "data": {"attributes": {"amount": bookingData.totalPrice}}
        }
        const capture = await paymongoService.create(`payment_intents/${intentId}/capture`, args);

        console.log(capture, "++++++++++++++++++++++++++++++++++++++");

        bookingData.update({
          status: 'booked'
        })

        bookingData.save();

        if (capture) {

          const payload = {
            notification: {
              title: `Booking # ${bookingData.id} Updated`,
              body: `Booking # ${bookingData.id} status is Updated to ${status}`,
              sound: 'default',
              badge: '1',
            },
            data: {
              bookingId: bookingData.id.toString()
            }
          };

          //triggers push notification to the targeted devices.
          return admin.messaging().sendToDevice(userData.FCM_TOKEN, payload);

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

      const payload = {
        notification: {
          title: `Booking # ${bookingData.id} Updated`,
          body: `Booking # ${bookingData.id} status is Updated to ${status}`,
          sound: 'default',
          badge: '1',
        },
        data: {
          bookingId: `${bookingData.id}`
        }
      };

      //triggers push notification to the targeted devices.
      admin.messaging().sendToDevice(userData.FCM_TOKEN, payload);

      res.status(200).send({
        message: 'Booking status is Updated to' + status,
      });

      bookingData.save();
    }


  } catch (e) {
    console.log(e.message)
  }
}

const createBooking = async (req, res) => {


  const {
    CarTypeId, startDate, endDate, UserId, PartnerId, extraFees, phone,
    bookingNotes, placeDescription, placeId, lat, lng, withDriver, carId
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

    // const bookedPartnerCars = await Car.findAll({
    //   include: [
    //     {
    //       model: Partner,
    //       as: 'partner',
    //       where: {
    //         id: PartnerId,
    //       },
    //       required: true,
    //     },
    //     {
    //       model: Booking,
    //       as: 'bookings',
    //       required: true,
    //       where: {
    //         [Op.or]: [{
    //           startDate: {
    //             [Op.between]: [common.toJSDate(startDate), common.toJSDate(endDate)],
    //           },
    //         }, {
    //           endDate: {
    //             [Op.between]: [common.toJSDate(startDate), common.toJSDate(endDate)],
    //           },
    //         }],
    //       },
    //     },
    //   ],
    // })
    //
    // const bookedPartnerCarIds = []
    //
    // if (bookedPartnerCars.length > 0) {
    //   bookedPartnerCars.forEach((bookedPartnerCar) => {
    //     bookedPartnerCarIds.push(bookedPartnerCar.id)
    //   })
    // }
    //
    // const allPartnerCars = await Car.findAll({
    //   include: [
    //     {
    //       model: Partner,
    //       as: 'partner',
    //       where: {
    //         id: PartnerId,
    //       },
    //     },
    //     {
    //       model: CarModel,
    //       as: 'model',
    //       required: true,
    //       include: [
    //         {
    //           model: CarType,
    //           as: 'carType',
    //           required: true,
    //           where: {
    //             id: CarTypeId,
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // })
    //
    // let filteredPartnerCars = _.remove(allPartnerCars, (car) => !bookedPartnerCarIds.includes(car.id))
    //
    // filteredPartnerCars = JSON.stringify(filteredPartnerCars)
    // filteredPartnerCars = JSON.parse(filteredPartnerCars)

    const filteredPartnerCars = await Car.findOne({
      where: {id: carId},
    })

    await model.sequelize.transaction(async (t) => {
      const bookingDays = moment(new Date(endDate)).diff(moment(new Date(startDate)), 'days')
      let fees = []

      // if (extraFees) {
      //   const feesArgs = []
      //   extraFees.forEach((extraFee) => {
      //     feesArgs.push({
      //       id: extraFee,
      //     })
      //   })
      //
      //   fees = await Fee.findAll({
      //     where: {
      //       [Op.or]: feesArgs,
      //     },
      //   })
      // }


      let amount = 0
      const bookingFees = []

      // if (fees.length > 0) {
      //   fees.forEach((fee) => {
      //     if (fee.type === 'recurring') {
      //       amount += fee.value * bookingDays
      //       bookingFees.push({
      //         amount: fee.value * bookingDays,
      //         currency: 'PHP',
      //         description: fee.name.replace('_', ' '),
      //         startDate: new Date(startDate),
      //         endDate: new Date(endDate)
      //       })
      //     } else {
      //       amount += fee.value
      //       bookingFees.push({
      //         amount: fee.value,
      //         currency: 'PHP',
      //         description: fee.name.replace('_', ' '),
      //         startDate: new Date(startDate),
      //         endDate: new Date(endDate)
      //       })
      //     }
      //   })
      // }


      bookingFees.push({
        amount: filteredPartnerCars?.price * bookingDays,
        currency: 'PHP',
        description: `Vehicle rental for ${bookingDays} day/s.`,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      })

      // the amount of car price
      amount += filteredPartnerCars?.price * bookingDays;

      //add the gas price
      // amount += 1000 + amount;

      //add driver fee

      if (withDriver === true) {
        amount = amount + (1000 * bookingDays);
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
        phone
      }, {transaction: t});

      const downPayment = amount;

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
            description: "Payment For Booking # " + booking.id,
          },

        },
      }

      args.data.attributes.amount = downPayment;

      console.log(filteredPartnerCars, args.data.attributes)


      const paymentIntent = await paymongoService.create('payment_intents', args)

      console.log(paymentIntent.data);

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
          carId: filteredPartnerCars.id,
          bookingId: booking.id,
          price: filteredPartnerCars?.price,
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
          bookingId: booking.id,
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

const DeleteBooking = async (req, res) => {

  await Booking.destroy({
    where: {
      id: req.body.id
    }
  });

  res.status(200).send({
    message: 'Booking '+req.body.id+' Deleted ',
  })
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

const paymentWebhook = async (req, res) => {
  try {
    console.log(req.body.data.attributes.type, ' ()()()()()()()()()()()()()()()()()()()()()');
    console.log(req.body.data.attributes.data, 'DATA ()()()()()()()()()()()()()()()()()()()()()');

    const paymentIntentId = req.body.data.attributes.data.attributes.payment_intent_id;
    const event = req.body.data.attributes.type;

    if (event === 'payment.failed') {
      const booking = await Booking.findOne({
        where: {
          paymentIntentId,
        }
      });

      booking.update({
        status: 'cancelled'
      });

      booking.save();


      const userData = await User.findOne({
        where: {
          id: booking.UserId
        }
      });

      const payload = {
        notification: {
          title: `Booking # ${booking.id} is Cancelled Payment Failed`,
          body: `Booking # ${booking.id} is Cancelled Payment Failed`,
          sound: 'default',
          badge: '1',
        },
        data: {
          bookingId: `${booking.id}`,
          isCancel: 'true'
        }
      };

      //triggers push notification to the targeted devices.
      admin.messaging().sendToDevice(userData.FCM_TOKEN, payload);

      return res.status(200).send({
        message: 'Booking Updated',
      })
    }

    if (event === 'payment.paid') {
      const booking = await Booking.findOne({
        where: {
          paymentIntentId,
        }
      });

      booking.update({
        status: 'booked'
      })

      booking.save();


      const userData = await User.findOne({
        where: {
          id: booking.UserId
        }
      });

      const payload = {
        notification: {
          title: `Booking # ${booking.id} Payment Confirmed`,
          body: `Booking # ${booking.id} is Booked`,
          sound: 'default',
          badge: '1',
        },
        data: {
          bookingId: `${booking.id}`
        }
      };

      //triggers push notification to the targeted devices.
      admin.messaging().sendToDevice(userData.FCM_TOKEN, payload);

      return res.status(200).send({
        message: 'Booking Updated',
      });
    }
    ;

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
  paymentWebhook,
  DeleteBooking,
}
