import { create } from 'zustand';
import { routesGetApi, routesPostApi, routesPutApi } from '../api/apis';
import { userToken } from '../config/userToken';

interface IZustand {
  set?: any;
  get?: any;
}

interface ISetChannel extends IZustand {
  value?: IChannel;
}

export interface IChannel {
  _id?: string;
  label?: string;
  name?: string;
}

interface IJoinProps {
  label?: string;
  token: string | null;
  name?: string;
}

interface IJoinChannel extends IZustand {
  value?: IJoinProps;
}

const channelDetails = {
  channels: [] as IChannel[],
  selectedChannel: null as any,
};

const displayChannels = ({ get }: IZustand) => {
  return get().channels;
};

const storeChannels = async ({ set }: any) => {
  await routesGetApi({ routeName: `/channels/${userToken}` }).then(
    ({ data }: any) => {
      return set({
        channels: data.map((e: any) => {
          return {
            _id: e._id,
            label: e.label,
          };
        }),
      });
    }
  );
};

const joinChannel = async ({ set, get, value }: IJoinChannel) => {
  let ch = get().channels;

  const response = await routesPostApi({
    routeName: '/channels',
    params: value,
  });
  return set({ channels: [...ch, response.data.data] });
};

const leaveChannel = async ({ set, get }: IJoinChannel) => {
  let { selectedChannel, channels } = get();

  await routesPutApi({
    routeName: `/channels/leave/${selectedChannel.label}`,
    params: { token: userToken },
  });

  const chList = [...channels];
  let indexToRemove = chList.findIndex(
    (channel) => channel.label === selectedChannel.label
  );
  if (indexToRemove !== -1) {
    chList.splice(indexToRemove, 1);
  }
  return set({ channels: [...chList], selectedChannel: null });
};

const pickChannel = async ({ set, value }: ISetChannel) => {
  const params = {
    label: value?.label,
    token: userToken,
  };
  const response = await routesPostApi({
    routeName: '/channels/details',
    params,
  });
  return set({ selectedChannel: response.data });
};

const displaySelectedCh = ({ get }: IZustand) => {
  return get().selectedChannel ?? { label: null, _id: null, name: null };
};

const channelStoreObject = (set: any, get: any) => ({
  ...channelDetails,
  displayChannels: () => displayChannels({ get }),
  displaySelectedChannel: () => displaySelectedCh({ get }),
  storeChannels: () => storeChannels({ set }),
  joinChannel: (value: IJoinProps) => joinChannel({ set, get, value }),
  pickChannel: (value: IChannel) => pickChannel({ set, value }),
  leaveChannel: () => leaveChannel({ set, get }),
});

export const channelStore = create(channelStoreObject);
