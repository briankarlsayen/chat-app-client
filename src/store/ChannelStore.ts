import { create } from 'zustand';
import { routesGetApi, routesPostApi, routesPutApi } from '../api/apis';
import { userToken } from '../config/userToken';

interface IZustand {
  set?: any;
  get?: any;
}

interface ISetChannel extends IZustand {
  value?: IChannel | null;
}

export interface IChannel {
  _id?: string;
  label: string;
  name?: string;
}

interface IJoinProps {
  label?: string;
  token: string | null;
  name?: string;
}

export interface ISelectedChannel {
  _id: string;
  label: string;
  name: string;
  token: string;
}

interface IJoinChannel extends IZustand {
  value?: IJoinProps;
}

const channelDetails = {
  channels: [] as IChannel[],
  selectedChannel: null as ISelectedChannel | null,
};

const displayChannels = ({ get }: IZustand) => {
  return get().channels;
};

const storeChannels = async ({ set }: any) => {
  await routesGetApi({ routeName: `/channels/${userToken}` }).then(
    ({ data }: any) => {
      const chList = data.map((e: IChannel) => {
        return {
          _id: e._id,
          label: e.label,
          name: e.name
        };
      });
      set({
        channels: chList
      });
      return chList;
    }
  );
};

const joinChannel = async ({ set, get, value }: IJoinChannel) => {
  let ch = get().channels;

  const response = await routesPostApi({
    routeName: '/channels',
    params: value,
  });
  const addNameResponse = { ...response.data.data, name: value?.name }
  return set({ channels: [...ch, addNameResponse] });
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

const pickChannel = async ({ set, get, value }: ISetChannel) => {
  let channels = get().channels;
  const selected = channels.find((channel: IChannel) => channel.label === value?.label)
  set({ selectedChannel: selected ?? null });
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
  pickChannel: (value?: IChannel | null) => pickChannel({ set, get, value }),
  leaveChannel: () => leaveChannel({ set, get }),
});

export const channelStore = create(channelStoreObject);
