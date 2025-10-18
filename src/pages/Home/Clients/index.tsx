import { clientLogos, clientLogosReverse } from "./clientData";
import styles from "./style.module.css";
import { defaultYMotionProps } from "@/config/motion_config";
import { motion } from "framer-motion";

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
          {clientLogos.map((src, index) => (
            <motion.div
              key={`mobile-logo-${index}`}
              {...defaultYMotionProps}
              initial={{ opacity: 0 }}
              transition={{
                duration: 1,
                delay: index * 0.2,
              }}
            >
              <LogoImage src={src} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* pc view */}
      <section className="hidden md:block w-full overflow-x-hidden py-12">
        {/* line 1 */}
        <motion.div
          className="relative flex items-center"
          {...defaultYMotionProps}
          initial={{ opacity: 0, y: 70 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className={`${styles.scrollTrack} flex gap-28`}>
            {[...clientLogos, ...clientLogos].map((src, index) => (
              <LogoImage key={`line1-${index}`} src={src} />
            ))}
          </div>
        </motion.div>

        {/* line 2 */}
        <motion.div
          className="relative flex items-center mt-16"
          {...defaultYMotionProps}
          initial={{ opacity: 0, y: 70 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className={`${styles.scrollTrackReverse} flex gap-28`}>
            {[...clientLogosReverse, ...clientLogosReverse].map(
              (src, index) => (
                <LogoImage key={`line2-${index}`} src={src} />
              )
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Clients;
