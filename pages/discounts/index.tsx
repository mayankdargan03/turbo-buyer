import { ArrowForwardIcon, EditIcon, LockIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, FormControl, FormLabel, HStack, IconButton, Radio, RadioGroup, Text, useRadio, useRadioGroup, VStack } from "@chakra-ui/react";
import { Field, Form, Formik, useFormik } from "formik";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectAvailableCoupons, Coupon, setSelectedCoupon } from "../../redux/slices/confirmationSlice";
import DiscountCard from "./../../components/DiscountCard/DiscountCard";
import styles from './discounts.module.scss';
import {useState} from 'react';


export default function Discounts() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const coupons: Coupon[] = useAppSelector(selectAvailableCoupons);
    const [isSelected, setIsSelected] = useState<Boolean>(false);
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>, handleChange: Function) => {
        // e.preventDefault();
        // e.stopPropagation();
        handleChange(e);
        setIsSelected(e.target.checked);
        
    }
    return (
        <>
            <Formik
                initialValues={{
                    coupon: null,
                }}
                onSubmit={(values) => {
                    dispatch(setSelectedCoupon(coupons.find(coupon => coupon.code === values.coupon)!))
                    router.back();
                }}
            >
                {({ values, errors, touched, handleBlur, handleChange }) => (
                    <Box className={styles.container}>
                        <Box className={styles.section}>
                            <Box className={`${styles.sectionContent} mobile-section`} mt={2} mb={2}>
                                <Text>Apply Discounts</Text>
                            </Box>
                        </Box>
                        <Box p={4}>
                            <Form>
                                <FormControl isInvalid={touched.coupon && !!errors.coupon} id='coupon'>
                                    <RadioGroup>
                                        <VStack align='flex-start' w={`100%`}>
                                            <RadioGroup w={`100%`}>
                                                {
                                                    coupons.map(coupon => (
                                                        <Box mb={4} key={coupon.code} className={`discount-card ${styles.card} ${values.coupon === coupon.code && isSelected ? styles.selectedCard : ''}`}>
                                                            <Radio display={`inline-flex`} w={`100%`} key={coupon.code} colorScheme='green' onBlur={handleBlur} onChange={(e: ChangeEvent<HTMLInputElement>) =>handleOnChange(e, handleChange)} name='coupon' value={coupon.code} className={`${styles.radio}`}>
                                                                <Box w={`100%`} flexGrow={1}>
                                                                    <DiscountCard coupon={coupon}></DiscountCard>
                                                                </Box>
                                                            </Radio>
                                                        </Box>
                                                    ))
                                                }
                                            </RadioGroup>
                                        </VStack>
                                    </RadioGroup>
                                </FormControl>

                                <Button isDisabled={!values.coupon} type="submit" w={`100%`} bg={`black`} color={`white`} _hover={{ background: `black` }}><LockIcon fontSize="xs" me={2} /> <Text as="span" fontSize="sm">Proceed to Payment <ArrowForwardIcon ms={2} /></Text></Button>
                            </Form>
                        </Box>
                    </Box>
                )}
            </Formik>
        </>
    )
}