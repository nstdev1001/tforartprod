export interface ClientLogo {
  src: string;
  name: string;
  url: string;
}

export const clientLogos: ClientLogo[] = [
  {
    src: "/images/clients/baker_mckenzie.png",
    name: "Baker McKenzie",
    url: "https://www.bakermckenzie.com/en/locations/asia-pacific/vietnam",
  },
  {
    src: "/images/clients/panasonic.png",
    name: "Panasonic",
    url: "https://www.panasonic.com/vn/",
  },
  {
    src: "/images/clients/bidv.png",
    name: "BIDV",
    url: "https://bidv.com.vn/",
  },
  {
    src: "/images/clients/viettel_ai.png",
    name: "Viettel AI",
    url: "https://viettelai.vn/",
  },
  {
    src: "/images/clients/hashtag_business_vn_2.png",
    name: "Hashtag Business Vietnam",
    url: "https://www.facebook.com/hashtagbusinessVietnam/",
  },
  {
    src: "/images/clients/seee.png",
    name: "SEEE",
    url: "https://www.facebook.com/seee.hust/",
  },
  {
    src: "/images/clients/beesweet.png",
    name: "Beesweet Vietnam",
    url: "https://www.facebook.com/p/Beesweet-Vietnam-61558853662156/",
  },
  {
    src: "/images/clients/baymax.png",
    name: "Baymax Studio",
    url: "https://www.facebook.com/baymaxstudio/",
  },
  {
    src: "/images/clients/recording_studio.png",
    name: "Number Eight Studio",
    url: "https://www.facebook.com/numbereightstudio",
  },
  {
    src: "/images/clients/tram_se_chia.png",
    name: "Trạm Sẻ Chia",
    url: "https://www.facebook.com/TramSeChia/",
  },
  {
    src: "/images/clients/VNAM.png",
    name: "VNAM",
    url: "https://www.facebook.com/www.vnam.edu.vn/",
  },
  {
    src: "/images/clients/tohe.png",
    name: "Tohe",
    url: "https://www.tohe.vn/",
  },
];

export const clientLogosReverse: ClientLogo[] = [
  clientLogos[7], // baymax
  clientLogos[6], // beesweet
  clientLogos[2], // bidv
  clientLogos[4], // hashtag_business_vn_2
  clientLogos[1], // panasonic
  clientLogos[8], // recording_studio
  clientLogos[9], // tram_se_chia
  clientLogos[11], // tohe
  clientLogos[3], // viettel_ai
  clientLogos[10], // VNAM
  clientLogos[5], // seee
  clientLogos[0], // baker_mckenzie
];
