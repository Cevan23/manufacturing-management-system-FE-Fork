import { Text, View, Dimensions, TextInput, StyleSheet, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getReportMonth, getReportYear } from "../../services/SaleForecastReport";
import { CustomButton, AppLoader } from "../../components";
import { LineChart } from "react-native-chart-kit";
import { ScrollView } from "react-native-gesture-handler";

// Sale forecast report page
// Author: Nguyen Cao Nhan
const SaleForecastReport = () => {
	const { token } = useGlobalContext();
	const [year, setYear] = useState(""); // State to store the year input
	const [dataMonth1, setDataMonth1] = useState([]);
	const [dataMonth3, setDataMonth3] = useState([]);
	const [dataMonth5, setDataMonth5] = useState([]);
	const [dataMonth7, setDataMonth7] = useState([]);
	const [dataMonth9, setDataMonth9] = useState([]);
	const [dataMonth12, setDataMonth12] = useState([]);
	const [dataYear1, setDataYear1] = useState([]);
	const [dataYear2, setDataYear2] = useState([]);
	const [dataYear3, setDataYear3] = useState([]);
	const [dataYear4, setDataYear4] = useState([]);
	const [dataYear5, setDataYear5] = useState([]);

	const [loading, setLoading] = useState(false);

	// Fetch data from the server
	// Author: Nguyen Cao Nhan
	async function fetchData(token, year) {
		setLoading(true);
		try {
			// Get data for each month (12 months) relying on the year input
			// Author: Nguyen Cao Nhan
			const res1 = await getReportMonth(token, 1, year);
			setDataMonth1(res1.result);

			const res3 = await getReportMonth(token, 3, year);
			setDataMonth3(res3.result);

			const res5 = await getReportMonth(token, 5, year);
			setDataMonth5(res5.result);

			const res7 = await getReportMonth(token, 7, year);
			setDataMonth7(res7.result);

			const res9 = await getReportMonth(token, 9, year);
			setDataMonth9(res9.result);

			const res12 = await getReportMonth(token, 12, year);
			setDataMonth12(res12.result);

			// Get data for each year (5 years) relying on the year input (last years)
			// Author: Nguyen Cao Nhan
			const res_1 = await getReportYear(token, year - 4);
			setDataYear1(res_1.result);

			const res_2 = await getReportYear(token, year - 3);
			setDataYear2(res_2.result);

			const res_3 = await getReportYear(token, year - 2);
			setDataYear3(res_3.result);

			const res_4 = await getReportYear(token, year - 1);
			setDataYear4(res_4.result);

			const res_5 = await getReportYear(token, year);
			setDataYear5(res_5.result);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<SafeAreaView style={styles.backgroundColor}>
			<View>
				<ScrollView>
					<View className="flex-row mb-2">
						<TextInput
							style={styles.input}
							placeholder="Enter year"
							keyboardType="numeric"
							value={year}
							onChangeText={(text) => setYear(text)}
						/>
						<CustomButton
							title="Statistics"
							handlePress={() => {
								fetchData(token, year);
							}}
							containerStyles="flex w-40 bg-green-500 ml-5"
						/>
					</View>
					<View className="flex justify-center items-center">
						<Text className="text-lg font-semibold text-white mr-2 justify-center">
							Total-Sale-Price Sale Forecast Line Chart
						</Text>
					</View>
					<LineChart
						data={{
							labels: [
								"January",
								"March",
								"May",
								"July",
								"September",
								"December",
							],
							datasets: [
								{
									data: [
										(dataMonth1?.total_price ?? 0) / 1000,
										(dataMonth3?.total_price ?? 0) / 1000,
										(dataMonth5?.total_price ?? 0) / 1000,
										(dataMonth7?.total_price ?? 0) / 1000,
										(dataMonth9?.total_price ?? 0) / 1000,
										(dataMonth12?.total_price ?? 0) / 1000,
									],
								},
							],
						}}
						width={Dimensions.get("window").width} // from react-native
						height={220}
						yAxisLabel=""
						yAxisSuffix="k"
						yAxisInterval={1} // optional, defaults to 1
						chartConfig={{
							backgroundColor: "#e26a00",
							backgroundGradientFrom: "#fb8c00",
							backgroundGradientTo: "#ffa726",
							decimalPlaces: 0, // optional, defaults to 2dp
							color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							style: {
								borderRadius: 16,
							},
							propsForDots: {
								r: "6",
								strokeWidth: "2",
								stroke: "#ffa726",
							},
						}}
						bezier
						style={{
							marginVertical: 8,
							borderRadius: 16,
						}}
					/>
					<View className="flex justify-center items-center">
						<Text className="text-lg font-semibold text-white mr-2 justify-center">
							Quantity Sale Forecast Month Line Chart
						</Text>
					</View>
					<LineChart
						data={{
							labels: [
								"January",
								"March",
								"May",
								"July",
								"September",
								"December",
							],
							datasets: [
								{
									data: [
										dataMonth1?.total_quantity ?? 0,
										dataMonth3?.total_quantity ?? 0,
										dataMonth5?.total_quantity ?? 0,
										dataMonth7?.total_quantity ?? 0,
										dataMonth9?.total_quantity ?? 0,
										dataMonth12?.total_quantity ?? 0,
									],
								},
							],
						}}
						width={Dimensions.get("window").width} // from react-native
						height={220}
						yAxisLabel=""
						yAxisSuffix=""
						yAxisInterval={1} // optional, defaults to 1
						chartConfig={{
							backgroundColor: "#000000",
							backgroundGradientFrom: "green",
							backgroundGradientTo: "yellow",
							decimalPlaces: 0, // optional, defaults to 2dp
							color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							style: {
								borderRadius: 16,
							},
							propsForDots: {
								r: "6",
								strokeWidth: "2",
								stroke: "#ffa726",
							},
						}}
						bezier
						style={{
							marginVertical: 8,
							borderRadius: 16,
						}}
					/>
					<View className="flex justify-center items-center">
						<Text className="text-lg font-semibold text-white mr-2 justify-center">
							Quantity Sale Forecast Year Line Chart
						</Text>
					</View>
					<LineChart
						data={{
							labels: [
								`${year}`,
								`${year - 1}`,
								`${year - 2}`,
								`${year - 3}`,
								`${year - 4}`,
							].reverse(),
							datasets: [
								{
									data: [
										dataYear1?.total_quantity ?? 0,
										dataYear2?.total_quantity ?? 0,
										dataYear3?.total_quantity ?? 0,
										dataYear4?.total_quantity ?? 0,
										dataYear5?.total_quantity ?? 0,
									],
								},
							],
						}}
						width={Dimensions.get("window").width} // from react-native
						height={220}
						yAxisLabel=""
						yAxisSuffix=""
						yAxisInterval={1} // optional, defaults to 1
						chartConfig={{
							backgroundColor: "#000000",
							backgroundGradientFrom: "blue",
							backgroundGradientTo: "green",
							decimalPlaces: 0, // optional, defaults to 2dp
							color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							style: {
								borderRadius: 16,
							},
							propsForDots: {
								r: "6",
								strokeWidth: "2",
								stroke: "#ffa726",
							},
						}}
						bezier
						style={{
							marginVertical: 8,
							borderRadius: 16,
						}}
					/>
				</ScrollView>
				{loading ? <AppLoader /> : null}
			</View>
		</SafeAreaView>
	);
};

// Styles for sale forecast report page
// Author: Nguyen Cao Nhan
const styles = StyleSheet.create({
	backgroundColor: {
		backgroundColor: "#161622",
		flex: 1,
		paddingTop: 0,
	},
	input: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#fff",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
		color: "#fff",
	},
	row: {
		flexDirection: "row",
		marginVertical: 0,
		marginHorizontal: 0,
		alignItems: "center",
		elevation: 1,
		borderRadius: 3,
		paddingHorizontal: 0,
		paddingVertical: 10,
		backgroundColor: "#fff",
		borderColor: "#fff",
	},
});

export default SaleForecastReport;
