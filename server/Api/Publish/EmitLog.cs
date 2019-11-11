using System;
using RabbitMQ.Client;
using System.Text;
using System.Collections.Generic; 

 namespace api.RabbitMQ
 {


        public class EmitLog 
        {
            public EmitLog(string[] args){
           
            emit(args);
            } 
            public static void emit(string[] args)
            {
                var factory = new ConnectionFactory() { HostName = "localhost" };
                using(var connection = factory.CreateConnection())
                using(var channel = connection.CreateModel())
                {
                    // channel.ExchangeDeclare(exchange: "logs", type: ExchangeType.Fanout);
                     channel.QueueDeclare( queue : "shorya",true,false,false,null);
                    //   channel.QueueBind(queue: queueName,
                    //           exchange: "logs",
                    //           routingKey: "");

                    var message = GetMessage(args);
                    var body = Encoding.UTF8.GetBytes(message);
                    channel.BasicPublish(exchange: "logs",
                                        routingKey: "",
                                        basicProperties: null,
                                        body: body);
                    Console.WriteLine(" [x] Sent {0}", message);
                }

                // Console.WriteLine(" Press [enter] to exit.");
                // Console.ReadLine();
            }

            private static string GetMessage(string[] args)
            {
                return ((args.Length > 0)
                    ? string.Join(" ", args)
                    : "info: Hello World!");
            }
        }

}