import json
from os import access
from typing import ChainMap
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.checks import messages
from .models import DataBase

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'tic_%s' % self.room_name
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        if len(DataBase.objects.filter(group_name=self.room_group_name))<=2:
            
            DataBase.objects.create(group_name=self.room_group_name,channel_name=self.channel_name)
        
        self.accept()
        return
        

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        DataBase.objects.filter(group_name=self.room_group_name,channel_name=self.channel_name).delete()

        print("disconnected and deleted form the server")




    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['action']

        # Send message to room group
        if message=="fetch_info":
            length_of_users=len(DataBase.objects.filter(group_name=self.room_group_name))
            if(length_of_users==1):
                print("there are only 1 user")
                async_to_sync(self.channel_layer.send)(
                    self.channel_name,
                    {
                        'type':'single.handler',
                        
                    }

                )
            elif length_of_users==2:
                print("there are only 2 user")
                li=DataBase.objects.filter(group_name=self.room_group_name)
                async_to_sync(self.channel_layer.send)(
                    li[0].channel_name,
                    {
                        'type':'double.handler',
                        'Icon':"X",
                        'Status':"ON"
                    }
                )
                async_to_sync(self.channel_layer.send)(
                    li[1].channel_name,
                    {
                        'type':'double.handler',
                        'Icon':"O",
                        'Status':"OFF"
                    }
                )
                
            
            elif length_of_users>2 or length_of_users<=0:
                async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type':'multi.handler',

                    }
                )
        elif message=="sync_switch":
            li=DataBase.objects.filter(group_name=self.room_group_name)
            for i in li:
                if i.channel_name!=self.channel_name:
                    async_to_sync(self.channel_layer.send)(
                        i.channel_name,
                        {
                            'type':'sync.handler',
                            'board':text_data_json['board'],

                        }
                    )
        else:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message
                }
            )

    def sync_handler(self,event):
        self.send(text_data=json.dumps({
            'action':'sync_switch',
            'board':event['board']
        }))
    def multi_handler(self,event):
        
        self.send(text_data=json.dumps({
            'action':'More than 2 members connected to a room'
            
        }))

    def double_handler(self,event):
        icon=event['Icon']
        stat=event['Status']
        self.send(text_data=json.dumps({
            'action':'start_everyone_is_ready',
            'Icon':icon,
            'status':stat,
        }))
    def single_handler(self,event):
        self.send(text_data=json.dumps({
            'action':"No_new_users_yet",
        }))
    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        print(message)
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))
        
