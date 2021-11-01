export default function apiResponse(response, data) {
  return response.status(200).json({
    statusCode: 200,
    resultData: data,
  })
}