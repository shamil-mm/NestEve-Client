
import NotificationModal from "../../components/layout/Modal/NotificationModal"
import { motion } from 'framer-motion'

const ShortNotification = () => {

  return (

    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <NotificationModal />
    </motion.div>

  )
}

export default ShortNotification
