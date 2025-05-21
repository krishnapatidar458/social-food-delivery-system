import mongoose from 'mongoose';
import Order from '../models/order.model.js';
import { io } from '../socket/socket.js';

/**
 * Set up MongoDB Change Streams to track and broadcast order status changes
 */
export const setupChangeStreams = async () => {
  try {
    console.log('Setting up MongoDB Change Streams...');
    
    // Set up order change streams
    const orderChangeStream = Order.watch(
      [
        { $match: { "operationType": { $in: ["update", "insert", "replace"] } } }
      ],
      { fullDocument: "updateLookup" }
    );

    orderChangeStream.on('change', async (change) => {
      try {
        if (change.operationType === 'update' || change.operationType === 'insert' || change.operationType === 'replace') {
          const order = change.fullDocument;
          
          if (order) {
            console.log(`Order ${order._id} changed: ${order.status}`);
            
            // Broadcast to specific order room
            io.to(`order_${order._id}`).emit('orderUpdate', {
              orderId: order._id,
              status: order.status,
              updatedAt: order.updatedAt,
              latestStatus: order.statusHistory && order.statusHistory.length > 0 
                ? order.statusHistory[order.statusHistory.length - 1]
                : null
            });
            
            // Broadcast to user
            io.to(`user_${order.user}`).emit('orderUpdate', {
              orderId: order._id,
              status: order.status,
              updatedAt: order.updatedAt
            });
            
            // Broadcast to delivery agent if assigned
            if (order.deliveryAgent) {
              io.to(`agent_${order.deliveryAgent}`).emit('orderUpdate', {
                orderId: order._id,
                status: order.status,
                updatedAt: order.updatedAt
              });
            }
          }
        }
      } catch (error) {
        console.error('Error processing order change stream event:', error);
      }
    });

    console.log('MongoDB Change Streams set up successfully');
    return true;
  } catch (error) {
    console.error('Error setting up MongoDB Change Streams:', error);
    return false;
  }
}; 
 