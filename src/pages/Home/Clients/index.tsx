import LogoLoop from "@/components/LogoLoop";
import { defaultYMotionProps } from "@/config/motion_config";
import { motion } from "framer-motion";
import { clientLogos, clientLogosReverse } from "./clientData";

const Clients = () => {
  const LogoImage = ({ src }: { src: string }) => (
    <motion.img
      className="h-[30px] object-contain object-center overflow-hidden self-center shrink-0 max-w-full my-auto"
      src={src}
      alt="logo brand image"
    />
  );

  return (
    <div className="flex flex-col gap-10">
      <motion.h3
        className="text-xl text-center uppercase font-semibold"
        {...defaultYMotionProps}
      >
        Được tin tưởng bởi các đơn vị doanh nghiệp
      </motion.h3>

      {/* sp view */}
      <section className="md:hidden">
        <motion.div className="grid grid-cols-3 gap-6 justify-items-center">
          {clientLogos.map((client, index) => (
            <motion.div
              key={`mobile-logo-${index}`}
              {...defaultYMotionProps}
              initial={{ opacity: 0 }}
              transition={{
                duration: 1,
                delay: index * 0.2,
              }}
            >
              <LogoImage src={client.src} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* pc view */}
      <section className="hidden md:block w-full overflow-x-hidden py-12">
        <div className="space-y-16">
          <LogoLoop
            logos={clientLogos.map((client) => ({
              src: client.src,
              alt: client.name,
              href: client.url,
              title: client.name,
            }))}
            logoHeight={30}
            gap={112}
            speed={90}
          />

          <LogoLoop
            logos={clientLogosReverse.map((client) => ({
              src: client.src,
              alt: client.name,
              href: client.url,
              title: client.name,
            }))}
            logoHeight={30}
            gap={112}
            speed={90}
            direction="right"
          />
        </div>
      </section>
    </div>
  );
};

export default Clients;
