# BookYourTrip - User Manual

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles](#user-roles)
4. [Customer Guide](#customer-guide)
5. [Provider Guide](#provider-guide)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## Introduction

BookYourTrip is a comprehensive ticket booking and management system designed for transportation services. It allows customers to search, book, and manage tickets while enabling providers to manage their routes, trips, and services.

### Key Features

- 🔐 Secure authentication with JWT
- 🎫 Easy ticket booking with seat selection
- 💰 Dynamic pricing based on demand
- 🔄 Flexible rescheduling with transparent penalties
- ❌ Quick cancellations
- 💳 Secure payment processing
- 📊 Real-time availability checking

---

## Getting Started

### Prerequisites

- Internet connection
- Valid email address
- Payment method (credit/debit card)

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Cookies enabled for session management

### Accessing the System

The system is available at:
- **Auth Service**: `http://your-domain:3001`
- **Booking Service**: `http://your-domain:3002`
- **AI Service**: `http://your-domain:3003`

API Documentation (Swagger UI):
- **Auth API**: `http://your-domain:3001/docs`
- **Booking API**: `http://your-domain:3002/docs`
- **AI API**: `http://your-domain:3003/docs`

---

## User Roles

### Customer

Customers can:
- Search for available trips
- Book tickets
- Make payments
- View booking history
- Edit passenger details
- Cancel bookings
- Reschedule bookings

### Provider

Providers can:
- Register their transportation service
- Create and manage routes
- Schedule trips
- Set base pricing
- View bookings
- Enable/disable services
- Update company information

---

## Customer Guide

### 1. Registration

**Endpoint**: `POST /auth/signup`

To register as a customer:

```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!",
  "role": "CUSTOMER"
}
```

**Response**: You'll receive a JWT token for authentication.

### 2. Login

**Endpoint**: `POST /auth/login`

```json
{
  "email": "customer@example.com",
  "password": "SecurePassword123!"
}
```

**Response**: JWT token (valid for 2 hours)

### 3. Searching for Trips

**Endpoint**: `GET /search`

Search for available trips using filters:

```
GET /search?from=New%20York&to=Boston&date=2025-10-15
```

**Query Parameters**:
- `from`: Source city (optional)
- `to`: Destination city (optional)
- `date`: Travel date in YYYY-MM-DD format (optional)

**Response**: List of available trips with details:
```json
[
  {
    "id": "trip123",
    "route": {
      "source": "New York",
      "destination": "Boston"
    },
    "departure": "2025-10-15T10:00:00Z",
    "capacity": 50,
    "basePrice": 3000
  }
]
```

### 4. Booking a Ticket

**Endpoint**: `POST /bookings`

**Headers**:
- `Authorization: Bearer <your-jwt-token>`
- `Idempotency-Key: <unique-key>` (optional, prevents duplicate bookings)

```json
{
  "tripId": "trip123",
  "seatNo": "A1",
  "passengerName": "John Doe",
  "passengerEmail": "john@example.com",
  "passengerPhone": "+1234567890"
}
```

**Response**:
```json
{
  "id": "booking456",
  "userId": "user789",
  "tripId": "trip123",
  "seatNo": "A1",
  "priceApplied": 3200,
  "state": "PENDING",
  "paymentState": "PENDING",
  "passengerName": "John Doe",
  "passengerEmail": "john@example.com",
  "passengerPhone": "+1234567890"
}
```

**Note**: The seat is temporarily held for 2 minutes to prevent double booking.

### 5. Making Payment

**Endpoint**: `POST /bookings/:id/payment`

**Headers**: `Authorization: Bearer <your-jwt-token>`

```json
{
  "cardNumber": "4111111111111111",
  "expiryDate": "12/25",
  "cvv": "123"
}
```

**Test Cards**:
- ✅ Success: Any card **not** starting with `0000`
- ❌ Failure: Cards starting with `0000`

**Response (Success)**:
```json
{
  "success": true,
  "message": "payment successful",
  "booking": {
    "id": "booking456",
    "paymentState": "PAID",
    "state": "CONFIRMED"
  }
}
```

### 6. Viewing Booking Details

**Endpoint**: `GET /bookings/:id`

**Headers**: `Authorization: Bearer <your-jwt-token>`

**Response**:
```json
{
  "id": "booking456",
  "userId": "user789",
  "tripId": "trip123",
  "seatNo": "A1",
  "priceApplied": 3200,
  "state": "CONFIRMED",
  "paymentState": "PAID",
  "passengerName": "John Doe",
  "trip": {
    "id": "trip123",
    "departure": "2025-10-15T10:00:00Z",
    "route": {
      "source": "New York",
      "destination": "Boston"
    }
  }
}
```

### 7. Editing Passenger Details

**Endpoint**: `PATCH /bookings/:id/passenger`

**Headers**: `Authorization: Bearer <your-jwt-token>`

```json
{
  "passengerName": "Jane Doe",
  "passengerEmail": "jane@example.com",
  "passengerPhone": "+9876543210"
}
```

**Note**: You can only edit your own bookings.

### 8. Cancelling a Booking

**Endpoint**: `POST /bookings/:id/cancel`

**Headers**: `Authorization: Bearer <your-jwt-token>`

**Response**: Booking with updated state `CANCELLED`

### 9. Rescheduling a Booking

**Endpoint**: `POST /bookings/:id/reschedule`

**Headers**: `Authorization: Bearer <your-jwt-token>`

```json
{
  "newTripId": "trip789",
  "newSeatNo": "B2"
}
```

**Penalty Rules**:
- 📅 **More than 24 hours before departure**: No penalty
- ⚠️ **Less than 24 hours before departure**: 20% penalty added to new price

**Response**:
```json
{
  "id": "booking456",
  "tripId": "trip789",
  "seatNo": "B2",
  "priceApplied": 3840,
  "state": "RESCHEDULED"
}
```

---

## Provider Guide

### 1. Provider Registration

**Endpoint**: `POST /auth/signup`

```json
{
  "email": "provider@transport.com",
  "password": "ProviderPass123!",
  "role": "PROVIDER"
}
```

### 2. Creating Your Company Profile

**Endpoint**: `POST /providers`

```json
{
  "name": "Express Bus Co."
}
```

### 3. Updating Company Details

**Endpoint**: `PATCH /providers/:id`

```json
{
  "name": "Express Bus Company",
  "email": "info@expressbus.com",
  "phone": "+1-800-EXPRESS",
  "description": "Reliable and comfortable bus services"
}
```

### 4. Creating Routes

**Endpoint**: `POST /routes`

```json
{
  "providerId": "provider123",
  "source": "New York",
  "destination": "Boston"
}
```

### 5. Scheduling Trips

**Endpoint**: `POST /trips`

```json
{
  "routeId": "route456",
  "departure": "2025-10-15T10:00:00Z",
  "capacity": 50,
  "basePrice": 3000
}
```

**Note**: 
- `basePrice` is in cents (e.g., 3000 = $30.00)
- Actual customer price may be dynamically adjusted based on demand

### 6. Managing Service Status

**Endpoint**: `PATCH /providers/:id/status`

```json
{
  "status": "DISABLED"
}
```

**Statuses**:
- `ACTIVE`: Service is available for bookings
- `DISABLED`: Service is temporarily unavailable

### 7. Viewing Bookings

Providers can view all bookings for their trips using the `GET /bookings/:id` endpoint with `PROVIDER` role authentication.

---

## API Reference

### Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (invalid input) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (e.g., seat already taken) |
| 500 | Internal server error |

### Error Response Format

```json
{
  "error": "description of the error"
}
```

### Pagination

Currently, all list endpoints return all results. Future versions will include pagination with:
- `limit`: Number of results per page
- `offset`: Starting position

---

## Troubleshooting

### Common Issues

#### 1. "missing token" Error

**Problem**: You're not authenticated.

**Solution**: 
1. Login using `POST /auth/login`
2. Copy the token from the response
3. Include it in the `Authorization` header as `Bearer <token>`

#### 2. "seat temporarily held" Error

**Problem**: Someone else is currently booking that seat.

**Solution**: 
- Wait 2 minutes and try again
- Or select a different seat

#### 3. "seat already taken" Error

**Problem**: The seat has been permanently booked.

**Solution**: Select a different seat

#### 4. "already paid" Error

**Problem**: You're trying to pay for a booking twice.

**Solution**: Check your booking status using `GET /bookings/:id`

#### 5. Payment Failure

**Problem**: Payment was declined.

**Solution**: 
- Check your card details
- For testing, ensure card doesn't start with `0000`
- Try a different payment method

#### 6. "forbidden" Error

**Problem**: You're trying to access/modify a resource you don't own.

**Solution**: 
- Ensure you're logged in with the correct account
- You can only modify your own bookings

### Getting Help

If you encounter issues not covered here:

1. **Check API Documentation**: Visit `/docs` endpoint for detailed API specifications
2. **Review Logs**: Check your request/response in browser developer tools
3. **Contact Support**: Email support@bookyourtrip.com

---

## Best Practices

### For Customers

1. **Book Early**: Prices may increase closer to departure due to dynamic pricing
2. **Use Idempotency Keys**: Prevent accidental duplicate bookings
3. **Provide Accurate Details**: Double-check passenger information before payment
4. **Cancel Early**: Avoid penalties by canceling/rescheduling >24 hours before departure

### For Providers

1. **Keep Information Updated**: Regularly update company contact details
2. **Monitor Capacity**: Don't oversell trips
3. **Set Competitive Pricing**: Use dynamic pricing insights from AI service
4. **Update Status**: Disable service during maintenance periods

### Security

1. **Never Share Tokens**: Keep your JWT tokens private
2. **Use Strong Passwords**: Minimum 8 characters with mix of letters, numbers, symbols
3. **Logout After Use**: Tokens expire after 2 hours
4. **Monitor Bookings**: Regularly check for unauthorized activity

---

## Appendix

### Price Display

All prices in the system are stored and displayed in **cents**:
- 1000 = $10.00
- 3000 = $30.00
- 10000 = $100.00

### Date Formats

All dates use ISO 8601 format:
- `2025-10-15` (date only)
- `2025-10-15T10:00:00Z` (date and time with timezone)

### Booking States

| State | Description |
|-------|-------------|
| PENDING | Booking created, awaiting payment |
| CONFIRMED | Payment successful, ticket issued |
| CANCELLED | Booking cancelled by customer |
| RESCHEDULED | Booking moved to different trip |

### Payment States

| State | Description |
|-------|-------------|
| PENDING | Awaiting payment |
| PROCESSING | Payment being processed |
| PAID | Payment successful |
| FAILED | Payment declined |
| REFUNDED | Payment refunded to customer |

---

## Contact Information

- **Website**: https://bookyourtrip.com
- **Support Email**: support@bookyourtrip.com
- **API Status**: https://status.bookyourtrip.com
- **Documentation**: https://docs.bookyourtrip.com

---

**Version**: 1.0.0  
**Last Updated**: October 12, 2025  
**© 2025 BookYourTrip. All rights reserved.**

